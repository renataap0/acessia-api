const solucoesSolicitacoesQueries = require("../queries/solucoesSolicitacoesQueries");

const vincularSolucaoSolicitacao = (payload) => {
  return solucoesSolicitacoesQueries.vincular(payload);
};

const listarSolucoesPorSolicitacao = (solicitacaoId) => {
  return solucoesSolicitacoesQueries.listarPorSolicitacao(solicitacaoId);
};

module.exports = {
  listarSolucoesPorSolicitacao,
  vincularSolucaoSolicitacao
};
