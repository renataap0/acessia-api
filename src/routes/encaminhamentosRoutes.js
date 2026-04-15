const express = require("express");
const router = express.Router();
const {
  atualizarEncaminhamento,
  criarEncaminhamento,
  listarPorSolicitacao
} = require("../controllers/encaminhamentosController");
const {
  validateAtLeastOneField,
  validateIdParam,
  validateRequiredFields
} = require("../middlewares/validate");

router.post(
  "/",
  validateRequiredFields(["solicitacoes_idsolicitacoes", "profissional_responsavel"]),
  criarEncaminhamento
);
router.get(
  "/solicitacao/:solicitacaoId",
  validateIdParam("solicitacaoId"),
  listarPorSolicitacao
);
router.patch(
  "/:id",
  validateIdParam(),
  validateAtLeastOneField(["observacao", "profissional_responsavel"]),
  atualizarEncaminhamento
);

module.exports = router;
