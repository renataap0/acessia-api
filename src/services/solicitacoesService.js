const iaService = require("./iaService");
const logsIaService = require("./logsIaService");
const solicitacoesQueries = require("../queries/solicitacoesQueries");
const solucoesQueries = require("../queries/solucoesQueries");
const solucoesSolicitacoesQueries = require("../queries/solucoesSolicitacoesQueries");
const AppError = require("../utils/AppError");
const {
  CANAIS_ENTRADA,
  TIPOS_BARREIRA,
  URGENCIAS
} = require("../utils/domain");
const { normalizeDate, toJsonString, toTinyInt } = require("../utils/normalize");

const SLA_RESPOSTA_HORAS = {
  critica: 2,
  alta: 4,
  media: 8,
  baixa: 24
};

const SLA_RESOLUCAO_HORAS = {
  critica: 12,
  alta: 24,
  media: 48,
  baixa: 72
};

const assertAllowed = (field, value, allowedValues) => {
  if (value !== undefined && value !== null && value !== "" && !allowedValues.includes(value)) {
    throw new AppError(`Valor invalido para ${field}.`, 400, {
      campo: field,
      valores_permitidos: allowedValues
    });
  }
};

const assertPositiveNumber = (field, value) => {
  if (value !== undefined && value !== null && value !== "" &&
    (Number.isNaN(Number(value)) || Number(value) <= 0)) {
    throw new AppError(`${field} deve ser um numero positivo.`, 400);
  }
};

const buildTextoTriagem = (payload) => {
  return [
    payload.texto,
    payload.descricao_dificuldade,
    payload.dificuldade_encontrada,
    payload.descricao,
    payload.descricao_original,
    payload.contexto_problema,
    payload.contexto,
    payload.impacto_trabalho
  ].filter(Boolean).join(" ");
};

const normalizePayload = (payload, classificacao = {}, isCreate = false) => {
  const criadoEm = normalizeDate(payload.criado_em);
  const descricaoDificuldade = payload.descricao_dificuldade ||
    payload.dificuldade_encontrada ||
    payload.descricao ||
    payload.texto;
  const contextoProblema = payload.contexto_problema || payload.contexto;
  const prioridade = payload.prioridade ||
    classificacao.prioridade ||
    payload.urgencia ||
    (isCreate ? "media" : undefined);
  const urgencia = payload.urgencia || prioridade;
  const tipoBarreira = payload.tipo_barreira || classificacao.tipo_barreira;
  const areaResponsavel = payload.area_responsavel || classificacao.area_responsavel;
  const hasClassificacao = Object.keys(classificacao).length > 0;
  const classificacaoIaJson = payload.classificacao_ia_json ||
    (isCreate || hasClassificacao
      ? {
        ...classificacao.classificacao_ia_json,
        tipo_barreira: tipoBarreira,
        prioridade,
        area_responsavel: areaResponsavel,
        precisa_profissional: classificacao.precisa_profissional,
        confianca_ia: classificacao.confianca_ia,
        acao_imediata: classificacao.acao_imediata
      }
      : undefined);

  // O schema atual define datas de resposta/resolucao como NOT NULL.
  // Mantemos valores padrao para nao quebrar inserts em bases ja geradas.
  const defaultDate = isCreate ? normalizeDate(payload.atualizado_em || criadoEm) : undefined;
  const slaRespostaHoras = payload.sla_resposta_horas ||
    (prioridade ? SLA_RESPOSTA_HORAS[prioridade] : undefined) ||
    (isCreate ? SLA_RESPOSTA_HORAS.media : undefined);
  const slaResolucaoHoras = payload.sla_resolucao_horas ||
    (prioridade ? SLA_RESOLUCAO_HORAS[prioridade] : undefined) ||
    (isCreate ? SLA_RESOLUCAO_HORAS.media : undefined);

  return {
    ...payload,
    canal: payload.canal || (isCreate ? "web" : undefined),
    tipo_barreira: tipoBarreira,
    urgencia,
    area_responsavel: areaResponsavel,
    precisa_profissional: toTinyInt(
      payload.precisa_profissional ?? classificacao.precisa_profissional
    ),
    confianca_ia: payload.confianca_ia ?? classificacao.confianca_ia ?? (isCreate ? 0 : undefined),
    classificacao_ia_json: toJsonString(classificacaoIaJson),
    atualizado_em: normalizeDate(payload.atualizado_em),
    criado_em: criadoEm,
    descricao_dificuldade: descricaoDificuldade,
    descricao_original: payload.descricao_original || descricaoDificuldade,
    contexto_problema: contextoProblema,
    impacto_trabalho: payload.impacto_trabalho,
    preferencia_comunicacao: payload.preferencia_comunicacao,
    apoio_imediato: toTinyInt(payload.apoio_imediato ?? payload.necessidade_apoio_imediato),
    prioridade,
    sla_resposta_horas: slaRespostaHoras === undefined ? undefined : Number(slaRespostaHoras),
    sla_resolucao_horas: slaResolucaoHoras === undefined ? undefined : Number(slaResolucaoHoras),
    data_primeira_resposta: payload.data_primeira_resposta || defaultDate,
    data_resolucao: payload.data_resolucao || defaultDate
  };
};

const validatePayload = (payload) => {
  assertAllowed("canal", payload.canal, CANAIS_ENTRADA);
  assertAllowed("tipo_barreira", payload.tipo_barreira, TIPOS_BARREIRA);
  assertAllowed("urgencia", payload.urgencia, URGENCIAS);
  assertAllowed("prioridade", payload.prioridade, URGENCIAS);
  assertPositiveNumber("sla_resposta_horas", payload.sla_resposta_horas);
  assertPositiveNumber("sla_resolucao_horas", payload.sla_resolucao_horas);
};

const listarSolicitacoes = (filters = {}) => solicitacoesQueries.listar({
  ...filters,
  apoio_imediato: filters.apoio_imediato === undefined
    ? undefined
    : toTinyInt(filters.apoio_imediato)
});

const buscarSolicitacaoPorId = async (id) => {
  const solicitacao = await solicitacoesQueries.buscarPorId(id);

  if (!solicitacao) {
    throw new AppError("Solicitacao nao encontrada.", 404);
  }

  return solicitacao;
};

const vincularSolucoesRecomendadas = async (solicitacaoId, classificacao) => {
  if (!classificacao.tipo_barreira) {
    return [];
  }

  let solucoes = await solucoesQueries.buscarRecomendadas({
    tipo_barreira: classificacao.tipo_barreira,
    area_responsavel: classificacao.area_responsavel,
    limite: 3
  });

  if (solucoes.length === 0) {
    solucoes = await solucoesQueries.buscarRecomendadas({
      tipo_barreira: classificacao.tipo_barreira,
      limite: 3
    });
  }

  await Promise.all(solucoes.map((solucao) => (
    solucoesSolicitacoesQueries.vincular({
      solucoes_idsolucoes: solucao.idsolucoes,
      solicitacoes_idsolicitacoes: solicitacaoId
    })
  )));

  return solucoes;
};

const registrarLogTriagem = async ({ texto, classificacao, tempoResposta, solicitacaoId }) => {
  await logsIaService.registrarLogIa({
    entrada_texto: texto,
    saida_classificacao: classificacao,
    modelo_utilizado: "simulador_regras_v1",
    tempo_resposta: tempoResposta,
    tipo_processo: "triagem",
    solicitacoes_idsolicitacoes: solicitacaoId
  });
};

const criarSolicitacao = async (payload) => {
  const textoTriagem = buildTextoTriagem(payload);
  const inicio = process.hrtime.bigint();
  const classificacao = iaService.classificarTexto(textoTriagem, {
    contexto: payload.contexto || payload.contexto_problema,
    canal: payload.canal,
    urgencia: payload.urgencia,
    prioridade: payload.prioridade
  });
  const tempoResposta = Number((Number(process.hrtime.bigint() - inicio) / 1e9).toFixed(3));
  const normalizedPayload = normalizePayload(payload, classificacao, true);

  validatePayload(normalizedPayload);

  const id = await solicitacoesQueries.criar(normalizedPayload);
  await registrarLogTriagem({
    texto: textoTriagem,
    classificacao,
    tempoResposta,
    solicitacaoId: id
  });
  const solucoesVinculadas = await vincularSolucoesRecomendadas(id, classificacao);

  return {
    id,
    classificacao_ia: classificacao,
    solucoes_vinculadas: solucoesVinculadas.map((solucao) => ({
      idsolucoes: solucao.idsolucoes,
      tipo_barreira: solucao.tipo_barreira,
      area_responsavel: solucao.area_responsavel,
      acao_recomendada: solucao.acao_recomendada
    }))
  };
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

const atualizarStatus = async () => {
  throw new AppError("A tabela solicitacoes atual nao possui coluna status.", 400);
};

const classificarUrgencia = async (id, urgencia) => {
  assertAllowed("urgencia", urgencia, URGENCIAS);

  const affectedRows = await solicitacoesQueries.atualizar(id, {
    urgencia,
    prioridade: urgencia,
    sla_resposta_horas: SLA_RESPOSTA_HORAS[urgencia],
    sla_resolucao_horas: SLA_RESOLUCAO_HORAS[urgencia],
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
