const feedbacksService = require("../services/feedbacksService");
const asyncHandler = require("../middlewares/asyncHandler");

const registrarFeedback = asyncHandler(async (req, res) => {
  const id = await feedbacksService.registrarFeedback(req.body);
  res.status(201).json({
    sucesso: true,
    mensagem: "Feedback registrado com sucesso.",
    dados: { id }
  });
});

const listarPorSolicitacao = asyncHandler(async (req, res) => {
  const feedbacks = await feedbacksService.listarFeedbacksPorSolicitacao(
    req.params.solicitacaoId
  );

  res.json({ sucesso: true, dados: feedbacks });
});

module.exports = {
  listarPorSolicitacao,
  registrarFeedback
};
