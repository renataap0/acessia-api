const encaminhamentosService = require("../services/encaminhamentosService");
const asyncHandler = require("../middlewares/asyncHandler");

const criarEncaminhamento = asyncHandler(async (req, res) => {
  const id = await encaminhamentosService.criarEncaminhamento(req.body);
  res.status(201).json({
    sucesso: true,
    mensagem: "Encaminhamento criado com sucesso.",
    dados: { id }
  });
});

const listarPorSolicitacao = asyncHandler(async (req, res) => {
  const encaminhamentos = await encaminhamentosService.listarEncaminhamentosPorSolicitacao(
    req.params.solicitacaoId
  );

  res.json({ sucesso: true, dados: encaminhamentos });
});

const atualizarEncaminhamento = asyncHandler(async (req, res) => {
  const encaminhamento = await encaminhamentosService.atualizarEncaminhamento(
    req.params.id,
    req.body
  );

  res.json({
    sucesso: true,
    mensagem: "Encaminhamento atualizado com sucesso.",
    dados: encaminhamento
  });
});

module.exports = {
  atualizarEncaminhamento,
  criarEncaminhamento,
  listarPorSolicitacao
};
