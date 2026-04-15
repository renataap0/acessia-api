const encaminhamentosQueries = require("../queries/encaminhamentosQueries");
const AppError = require("../utils/AppError");
const { normalizeDate } = require("../utils/normalize");

const criarEncaminhamento = async (payload) => {
  return encaminhamentosQueries.criar({
    ...payload,
    criado_em: normalizeDate(payload.criado_em)
  });
};

const listarEncaminhamentosPorSolicitacao = (solicitacaoId) => {
  return encaminhamentosQueries.listarPorSolicitacao(solicitacaoId);
};

const atualizarEncaminhamento = async (id, payload) => {
  const affectedRows = await encaminhamentosQueries.atualizar(id, payload);

  if (affectedRows === 0) {
    throw new AppError("Encaminhamento nao encontrado.", 404);
  }

  return { id: Number(id), ...payload };
};

module.exports = {
  atualizarEncaminhamento,
  criarEncaminhamento,
  listarEncaminhamentosPorSolicitacao
};
