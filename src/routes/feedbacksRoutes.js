const express = require("express");
const router = express.Router();
const {
  listarPorSolicitacao,
  registrarFeedback
} = require("../controllers/feedbacksController");
const { validateIdParam, validateRequiredFields } = require("../middlewares/validate");

router.post(
  "/",
  validateRequiredFields(["solicitacoes_idsolicitacoes", "comentario"]),
  registrarFeedback
);
router.get(
  "/solicitacao/:solicitacaoId",
  validateIdParam("solicitacaoId"),
  listarPorSolicitacao
);

module.exports = router;
