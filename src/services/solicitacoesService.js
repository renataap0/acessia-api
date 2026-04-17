const solicitacoesQueries = require("../queries/solicitacoesQueries");
const AppError = require("../utils/AppError");
const {
  CANAIS_ENTRADA,
  SLA_HORAS_POR_URGENCIA,
  STATUS_SOLICITACAO,
  TIPOS_BARREIRA,
  URGENCIAS
} = require("../utils/domain");
const { normalizeDate, toJsonString, toTinyInt } = require("../utils/normalize");

const assertAllowed = (field, value, allowedValues) => {
  if (value !== undefined && value !== null && value !== "" && !allowedValues.includes(value)) {
    throw new AppError(`Valor invalido para ${field}.`, 400, {
      campo: field,
      valores_permitidos: allowedValues
    });
  }
};

const addHours = (date, hours) => {
  const baseDate = date ? new Date(date) : new Date();
  return new Date(baseDate.getTime() + Number(hours || 0) * 60 * 60 * 1000);
};

const resolveSlaHours = (payload, isCreate = false) => {
  if (payload.sla_horas !== undefined && payload.sla_horas !== null && payload.sla_horas !== "") {
    return Number(payload.sla_horas);
  }

  if (payload.urgencia || isCreate) {
    return SLA_HORAS_POR_URGENCIA[payload.urgencia || "media"];
  }

  return undefined;
};

const normalizePayload = (payload, isCreate = false) => {
  const criadoEm = isCreate ? normalizeDate(payload.criado_em) : payload.criado_em;
  const urgencia = payload.urgencia || (isCreate ? "media" : undefined);
  const prioridade = payload.prioridade || urgencia;
  const slaHoras = resolveSlaHours({ ...payload, urgencia }, isCreate);
  const classificacaoIaJson = payload.classificacao_ia_json ||
    payload.classificacao_inicial_ia_json ||
    payload.classificacao_ia;

  // Mantem compatibilidade com "descricao" e com o novo campo de dificuldade.
  const dificuldadeEncontrada = payload.dificuldade_encontrada || payload.descricao;

  return {
    ...payload,
    canal: payload.canal || (isCreate ? "web" : undefined),
    tipo_barreira: payload.tipo_barreira,
    dificuldade_encontrada: dificuldadeEncontrada,
    descricao: payload.descricao || dificuldadeEncontrada,
    urgencia,
    prioridade,
    status: payload.status || (isCreate ? "aberta" : undefined),
    necessidade_apoio_imediato: toTinyInt(
      payload.necessidade_apoio_imediato ?? payload.apoio_imediato
    ),
    precisa_profissional: toTinyInt(payload.precisa_profissional),
    classificacao_inicial_ia: payload.classificacao_inicial_ia || payload.tipo_barreira,
    classificacao_ia_json: toJsonString(classificacaoIaJson),
    sla_horas: slaHoras,
    prazo_sla: payload.prazo_sla || (isCreate ? addHours(criadoEm, slaHoras) : undefined),
    criado_em: criadoEm,
    atualizado_em: normalizeDate(payload.atualizado_em)
  };
};

const validatePayload = (payload) => {
  assertAllowed("canal", payload.canal, CANAIS_ENTRADA);
  assertAllowed("tipo_barreira", payload.tipo_barreira, TIPOS_BARREIRA);
  assertAllowed("urgencia", payload.urgencia, URGENCIAS);
  assertAllowed("prioridade", payload.prioridade, URGENCIAS);
  assertAllowed("status", payload.status, STATUS_SOLICITACAO);

  if (payload.sla_horas !== undefined && (Number.isNaN(Number(payload.sla_horas)) || Number(payload.sla_horas) <= 0)) {
    throw new AppError("sla_horas deve ser um numero positivo.", 400);
  }
};

const listarSolicitacoes = (filters = {}) => solicitacoesQueries.listar({
  ...filters,
  necessidade_apoio_imediato: filters.necessidade_apoio_imediato === undefined
    ? undefined
    : toTinyInt(filters.necessidade_apoio_imediato)
});

const buscarSolicitacaoPorId = async (id) => {
  const solicitacao = await solicitacoesQueries.buscarPorId(id);

  if (!solicitacao) {
    throw new AppError("Solicitacao nao encontrada.", 404);
  }

  return solicitacao;
};

const criarSolicitacao = async (payload) => {
  const normalizedPayload = normalizePayload(payload, true);
  validatePayload(normalizedPayload);
  return solicitacoesQueries.criar(normalizedPayload);
};

const atualizarSolicitacao = async (id, payload) => {
  const normalizedPayload = normalizePayload(payload);
  validatePayload(normalizedPayload);

  const affectedRows = await solicitacoesQueries.atualizar(id, normalizedPayload);

  if (affectedRows === 0) {
    throw new AppError("Solicitacao nao encontrada.", 404);
  }

  return buscarSolicitacaoPorId(id);
};

const atualizarStatus = async (id, status) => {
  assertAllowed("status", status, STATUS_SOLICITACAO);

  const solicitacaoAtual = await buscarSolicitacaoPorId(id);
  const statusComResposta = ["em_andamento", "encaminhada", "resolvida", "concluida"];
  const statusResolvido = ["resolvida", "concluida"];
  const payload = {
    status,
    atualizado_em: new Date()
  };

  // A primeira resposta e a resolucao alimentam os indicadores de SLA.
  if (!solicitacaoAtual.data_primeira_resposta && statusComResposta.includes(status)) {
    payload.data_primeira_resposta = new Date();
  }

  if (!solicitacaoAtual.data_resolucao && statusResolvido.includes(status)) {
    payload.data_resolucao = new Date();
  }

  const affectedRows = await solicitacoesQueries.atualizar(id, payload);

  if (affectedRows === 0) {
    throw new AppError("Solicitacao nao encontrada.", 404);
  }

  return buscarSolicitacaoPorId(id);
};

const classificarUrgencia = async (id, urgencia) => {
  assertAllowed("urgencia", urgencia, URGENCIAS);

  const solicitacaoAtual = await buscarSolicitacaoPorId(id);
  const slaHoras = SLA_HORAS_POR_URGENCIA[urgencia] || solicitacaoAtual.sla_horas;
  const affectedRows = await solicitacoesQueries.atualizar(id, {
    urgencia,
    prioridade: urgencia,
    sla_horas: slaHoras,
    prazo_sla: addHours(solicitacaoAtual.criado_em || solicitacaoAtual.created_at, slaHoras),
    atualizado_em: new Date()
  });

  if (affectedRows === 0) {
    throw new AppError("Solicitacao nao encontrada.", 404);
  }

  return buscarSolicitacaoPorId(id);
};

const associarUsuario = async (id, usuariosIdusuarios) => {
  const affectedRows = await solicitacoesQueries.atualizar(id, {
    usuarios_idusuarios: usuariosIdusuarios,
    atualizado_em: new Date()
  });

  if (affectedRows === 0) {
    throw new AppError("Solicitacao nao encontrada.", 404);
  }

  return buscarSolicitacaoPorId(id);
};

module.exports = {
  associarUsuario,
  atualizarSolicitacao,
  atualizarStatus,
  buscarSolicitacaoPorId,
  classificarUrgencia,
  criarSolicitacao,
  listarSolicitacoes
};
