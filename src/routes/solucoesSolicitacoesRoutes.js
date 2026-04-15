const express = require("express");
const router = express.Router();
const {
  listarPorSolicitacao,
  vincular
} = require("../controllers/solucoesSolicitacoesController");
const { validateIdParam, validateRequiredFields } = require("../middlewares/validate");

router.post(
  "/",
  validateRequiredFields(["solucoes_idsolucoes", "solicitacoes_idsolicitacoes"]),
  vincular
);
router.get(
  "/solicitacao/:solicitacaoId",
  validateIdParam("solicitacaoId"),
  listarPorSolicitacao
);

module.exports = router;
