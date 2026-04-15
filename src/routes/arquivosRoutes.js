const express = require("express");
const router = express.Router();
const {
  cadastrarArquivo,
  listarPorSolicitacao
} = require("../controllers/arquivosController");
const { validateIdParam, validateRequiredFields } = require("../middlewares/validate");

router.post(
  "/",
  validateRequiredFields(["solicitacoes_idsolicitacoes", "nome_original", "caminho_arquivo"]),
  cadastrarArquivo
);
router.get(
  "/solicitacao/:solicitacaoId",
  validateIdParam("solicitacaoId"),
  listarPorSolicitacao
);

module.exports = router;
