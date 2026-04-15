const solucaoRelacionadaQueries = require("../queries/solucaoRelacionadaQueries");
const { normalizeDate, toTinyInt } = require("../utils/normalize");

const salvarSolucaoRelacionada = async (payload) => {
  return solucaoRelacionadaQueries.criar({
    ...payload,
    aplicacao_solucao: toTinyInt(payload.aplicacao_solucao),
    data_aplicacao: normalizeDate(payload.data_aplicacao)
  });
};

const listarPorSolicitacao = (solicitacaoId) => {
  return solucaoRelacionadaQueries.listarPorSolicitacao(solicitacaoId);
};

module.exports = {
  listarPorSolicitacao,
  salvarSolucaoRelacionada
};
