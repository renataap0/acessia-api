const express = require("express");
const router = express.Router();
const {
  listarSolucoes,
  criarSolucao
} = require("../controllers/solucoesController");

router.get("/", listarSolucoes);
router.post("/", criarSolucao);

module.exports = router;