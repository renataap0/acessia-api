const logsIaService = require("../services/logsIaService");
const asyncHandler = require("../middlewares/asyncHandler");

const registrarLogIa = asyncHandler(async (req, res) => {
  const id = await logsIaService.registrarLogIa(req.body);
  res.status(201).json({
    sucesso: true,
    mensagem: "Log de IA registrado com sucesso.",
    dados: { id }
  });
});

const listarPorSolicitacao = asyncHandler(async (req, res) => {
  const logs = await logsIaService.listarLogsPorSolicitacao(req.params.solicitacaoId);
  res.json({ sucesso: true, dados: logs });
});

module.exports = {
  listarPorSolicitacao,
  registrarLogIa
};
