const solucoesSolicitacoesService = require("../services/solucoesSolicitacoesService");
const asyncHandler = require("../middlewares/asyncHandler");

const vincular = asyncHandler(async (req, res) => {
  await solucoesSolicitacoesService.vincularSolucaoSolicitacao(req.body);
  res.status(201).json({
    sucesso: true,
    mensagem: "Solucao vinculada a solicitacao com sucesso."
  });
});

const listarPorSolicitacao = asyncHandler(async (req, res) => {
  const solucoes = await solucoesSolicitacoesService.listarSolucoesPorSolicitacao(
    req.params.solicitacaoId
  );

  res.json({ sucesso: true, dados: solucoes });
});

module.exports = {
  listarPorSolicitacao,
  vincular
};
