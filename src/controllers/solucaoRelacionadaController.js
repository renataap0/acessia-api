const solucaoRelacionadaService = require("../services/solucaoRelacionadaService");
const asyncHandler = require("../middlewares/asyncHandler");

const salvarSolucaoRelacionada = asyncHandler(async (req, res) => {
  const id = await solucaoRelacionadaService.salvarSolucaoRelacionada(req.body);
  res.status(201).json({
    sucesso: true,
    mensagem: "Solucao relacionada salva com sucesso.",
    dados: { id }
  });
});

const listarPorSolicitacao = asyncHandler(async (req, res) => {
  const solucoes = await solucaoRelacionadaService.listarPorSolicitacao(
    req.params.solicitacaoId
  );

  res.json({ sucesso: true, dados: solucoes });
});

module.exports = {
  listarPorSolicitacao,
  salvarSolucaoRelacionada
};
