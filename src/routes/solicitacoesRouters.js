const express = require("express");
const router = express.Router();
const {
  listarSolicitacoes,
  buscarSolicitacaoPorId,
  criarSolicitacao
} = require("../controllers/solicitacoesController");

router.get("/", listarSolicitacoes);
router.get("/:id", buscarSolicitacaoPorId);
router.post("/", criarSolicitacao);

module.exports = router;