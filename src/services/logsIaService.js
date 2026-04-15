const logsIaQueries = require("../queries/logsIaQueries");
const { normalizeDate, toJsonString } = require("../utils/normalize");

const registrarLogIa = async (payload) => {
  return logsIaQueries.criar({
    ...payload,
    saida: toJsonString(payload.saida),
    criado_em: normalizeDate(payload.criado_em)
  });
};

const listarLogsPorSolicitacao = (solicitacaoId) => {
  return logsIaQueries.listarPorSolicitacao(solicitacaoId);
};

module.exports = {
  listarLogsPorSolicitacao,
  registrarLogIa
};
