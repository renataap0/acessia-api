const solicitacoesQueries = require("../queries/solicitacoesQueries");
const AppError = require("../utils/AppError");
const { normalizeDate, toJsonString, toTinyInt } = require("../utils/normalize");

const normalizePayload = (payload) => ({
  ...payload,
  status: payload.status || "aberta",
  precisa_profissional: toTinyInt(payload.precisa_profissional),
  classificacao_ia_json: toJsonString(payload.classificacao_ia_json),
  criado_em: normalizeDate(payload.criado_em),
  atualizado_em: normalizeDate(payload.atualizado_em)
});

const listarSolicitacoes = (filters) => solicitacoesQueries.listar(filters);

const buscarSolicitacaoPorId = async (id) => {
  const solicitacao = await solicitacoesQueries.buscarPorId(id);

  if (!solicitacao) {
    throw new AppError("Solicitacao nao encontrada.", 404);
  }

  return solicitacao;
};

const criarSolicitacao = async (payload) => {
  return solicitacoesQueries.criar(normalizePayload(payload));
};

const atualizarStatus = async (id, status) => {
  const affectedRows = await solicitacoesQueries.atualizar(id, {
    status,
    atualizado_em: new Date()
  });

  if (affectedRows === 0) {
    throw new AppError("Solicitacao nao encontrada.", 404);
  }

  return buscarSolicitacaoPorId(id);
};

const classificarUrgencia = async (id, urgencia) => {
  const affectedRows = await solicitacoesQueries.atualizar(id, {
    urgencia,
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
  atualizarStatus,
  buscarSolicitacaoPorId,
  classificarUrgencia,
  criarSolicitacao,
  listarSolicitacoes
};
