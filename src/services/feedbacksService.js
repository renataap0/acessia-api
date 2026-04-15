const feedbacksQueries = require("../queries/feedbacksQueries");
const { normalizeDate } = require("../utils/normalize");

const registrarFeedback = async (payload) => {
  return feedbacksQueries.criar({
    ...payload,
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
