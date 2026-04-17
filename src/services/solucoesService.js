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

const normalizePayload = (payload, isCreate = false) => {
  const contextoProblema = payload.contexto_problema || payload.descricao_problema;
  const solucaoProvisoria = payload.solucao_provisoria || payload.solucao_imediata;
  const acaoRecomendada = payload.acao_recomendada || solucaoProvisoria;

  return {
    ...payload,
    contexto_problema: contextoProblema,
    descricao_problema: payload.descricao_problema || contextoProblema,
    acao_recomendada: acaoRecomendada,
    solucao_provisoria: solucaoProvisoria,
    solucao_imediata: payload.solucao_imediata || solucaoProvisoria,
    urgencia: payload.urgencia || (isCreate ? "media" : undefined),
    ativo: payload.ativo === undefined
      ? (isCreate ? 1 : undefined)
      : toTinyInt(payload.ativo)
  };
};

const validatePayload = (payload) => {
  assertAllowed("tipo_barreira", payload.tipo_barreira, TIPOS_BARREIRA);
  assertAllowed("urgencia", payload.urgencia, URGENCIAS);
};

const listarSolucoes = (filters) => {
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
