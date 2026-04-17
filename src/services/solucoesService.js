const solucoesQueries = require("../queries/solucoesQueries");
const AppError = require("../utils/AppError");
const { TIPOS_BARREIRA, URGENCIAS } = require("../utils/domain");
const { toTinyInt } = require("../utils/normalize");

const assertAllowed = (field, value, allowedValues) => {
  if (value !== undefined && value !== null && value !== "" && !allowedValues.includes(value)) {
    throw new AppError(`Valor invalido para ${field}.`, 400, {
      campo: field,
      valores_permitidos: allowedValues
    });
  }
};

const normalizePayload = (payload, isCreate = false) => ({
  ...payload,
  solucao_provisoria: payload.solucao_provisoria,
  contexto_problema: payload.contexto_problema,
  urgencia: payload.urgencia || (isCreate ? "media" : undefined),
  tipo_barreira: payload.tipo_barreira,
  acao_recomendada: payload.acao_recomendada || payload.solucao_provisoria,
  area_responsavel: payload.area_responsavel,
  ativo: payload.ativo === undefined ? (isCreate ? 1 : undefined) : toTinyInt(payload.ativo),
  solucao_estrutural: payload.solucao_estrutural,
  custo_estimado: payload.custo_estimado === undefined ? (isCreate ? 0 : undefined) : payload.custo_estimado,
  prazo_estimado_dias: payload.prazo_estimado_dias === undefined
    ? (isCreate ? 1 : undefined)
    : payload.prazo_estimado_dias
});

const validatePayload = (payload) => {
  assertAllowed("tipo_barreira", payload.tipo_barreira, TIPOS_BARREIRA);
  assertAllowed("urgencia", payload.urgencia, URGENCIAS);

  if (payload.custo_estimado !== undefined && Number.isNaN(Number(payload.custo_estimado))) {
    throw new AppError("custo_estimado deve ser numerico.", 400);
  }

  if (payload.prazo_estimado_dias !== undefined &&
    (!Number.isInteger(Number(payload.prazo_estimado_dias)) || Number(payload.prazo_estimado_dias) < 0)) {
    throw new AppError("prazo_estimado_dias deve ser um inteiro positivo.", 400);
  }
};

const listarSolucoes = (filters = {}) => {
  return solucoesQueries.listar({
    ...filters,
    ativo: filters.ativo === undefined ? undefined : toTinyInt(filters.ativo)
  });
};

const buscarSolucaoPorId = async (id) => {
  const solucao = await solucoesQueries.buscarPorId(id);

  if (!solucao) {
    throw new AppError("Solucao nao encontrada.", 404);
  }

  return solucao;
};

const criarSolucao = async (payload) => {
  const normalizedPayload = normalizePayload(payload, true);
  validatePayload(normalizedPayload);
  return solucoesQueries.criar(normalizedPayload);
};

const atualizarSolucao = async (id, payload) => {
  const normalizedPayload = normalizePayload(payload);
  validatePayload(normalizedPayload);
  const affectedRows = await solucoesQueries.atualizar(id, normalizedPayload);

  if (affectedRows === 0) {
    throw new AppError("Solucao nao encontrada.", 404);
  }

  return buscarSolucaoPorId(id);
};

const atualizarAtivo = async (id, ativo) => {
  return atualizarSolucao(id, { ativo });
};

module.exports = {
  atualizarAtivo,
  atualizarSolucao,
  buscarSolucaoPorId,
  criarSolucao,
  listarSolucoes
};
