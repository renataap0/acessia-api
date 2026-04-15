const express = require("express");
const router = express.Router();
const {
  listarPorSolicitacao,
  registrarLogIa
} = require("../controllers/logsIaController");
const { validateIdParam, validateRequiredFields } = require("../middlewares/validate");

router.post(
  "/",
  validateRequiredFields(["solicitacoes_idsolicitacoes", "entrada", "saida"]),
  registrarLogIa
);
router.get(
  "/solicitacao/:solicitacaoId",
  validateIdParam("solicitacaoId"),
  listarPorSolicitacao
);

module.exports = router;
