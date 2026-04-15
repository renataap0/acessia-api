const arquivosQueries = require("../queries/arquivosQueries");
const { normalizeDate } = require("../utils/normalize");

const cadastrarArquivo = async (payload) => {
  return arquivosQueries.criar({
    ...payload,
    criado_em: normalizeDate(payload.criado_em)
  });
};

const listarArquivosPorSolicitacao = (solicitacaoId) => {
  return arquivosQueries.listarPorSolicitacao(solicitacaoId);
};

module.exports = {
  cadastrarArquivo,
  listarArquivosPorSolicitacao
};
