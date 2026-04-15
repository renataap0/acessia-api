const express = require("express");
const router = express.Router();
const {
  listarPorSolicitacao,
  salvarSolucaoRelacionada
} = require("../controllers/solucaoRelacionadaController");
const { validateIdParam, validateRequiredFields } = require("../middlewares/validate");

router.post(
  "/",
  validateRequiredFields([
    "solicitacoes_idsolicitacoes",
    "solucoes_idsolucoes",
    "similaridade"
  ]),
  salvarSolucaoRelacionada
);
router.get(
  "/solicitacao/:solicitacaoId",
  validateIdParam("solicitacaoId"),
  listarPorSolicitacao
);

module.exports = router;
