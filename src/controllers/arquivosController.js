const arquivosService = require("../services/arquivosService");
const asyncHandler = require("../middlewares/asyncHandler");

const cadastrarArquivo = asyncHandler(async (req, res) => {
  const id = await arquivosService.cadastrarArquivo(req.body);
  res.status(201).json({
    sucesso: true,
    mensagem: "Arquivo cadastrado com sucesso.",
    dados: { id }
  });
});

const listarPorSolicitacao = asyncHandler(async (req, res) => {
  const arquivos = await arquivosService.listarArquivosPorSolicitacao(
    req.params.solicitacaoId
  );

  res.json({ sucesso: true, dados: arquivos });
});

module.exports = {
  cadastrarArquivo,
  listarPorSolicitacao
};
