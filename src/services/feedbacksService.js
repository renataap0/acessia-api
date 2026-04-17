const feedbacksQueries = require("../queries/feedbacksQueries");
const { normalizeDate, toTinyInt } = require("../utils/normalize");

const registrarFeedback = async (payload) => {
  return feedbacksQueries.criar({
    ...payload,
    funcionou: toTinyInt(payload.funcionou),
    nota_satisfacao: payload.nota_satisfacao || payload.nota,
    criado_em: normalizeDate(payload.criado_em)
  });
};

const listarFeedbacksPorSolicitacao = (solicitacaoId) => {
  return feedbacksQueries.listarPorSolicitacao(solicitacaoId);
};

module.exports = {
  listarFeedbacksPorSolicitacao,
  registrarFeedback
};
