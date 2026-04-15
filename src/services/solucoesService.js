const solucoesQueries = require("../queries/solucoesQueries");
const AppError = require("../utils/AppError");
const { toTinyInt } = require("../utils/normalize");

const normalizeCreatePayload = (payload) => ({
  ...payload,
  ativo: payload.ativo === undefined ? 1 : toTinyInt(payload.ativo)
});

const normalizeUpdatePayload = (payload) => ({
  ...payload,
  ativo: payload.ativo === undefined ? undefined : toTinyInt(payload.ativo)
});

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
  return solucoesQueries.criar(normalizeCreatePayload(payload));
};

const atualizarSolucao = async (id, payload) => {
  const affectedRows = await solucoesQueries.atualizar(id, normalizeUpdatePayload(payload));

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
