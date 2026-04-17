const express = require("express");
const router = express.Router();
const {
  atualizarAtivo,
  atualizarSolucao,
  buscarSolucaoPorId,
  listarSolucoes,
  criarSolucao
} = require("../controllers/solucoesRestController");
const {
  validateAtLeastOneField,
  validateIdParam,
  validateRequiredFields
} = require("../middlewares/validate");

router.get("/", listarSolucoes);
router.get("/:id", validateIdParam(), buscarSolucaoPorId);
router.post(
  "/",
  validateRequiredFields([
    "titulo",
    "tipo_barreira",
    "contexto_problema",
    "acao_recomendada",
    "area_responsavel"
  ]),
  criarSolucao
);
router.put(
  "/:id",
  validateIdParam(),
  validateAtLeastOneField([
    "titulo",
    "tipo_barreira",
    "contexto_problema",
    "acao_recomendada",
    "area_responsavel",
    "urgencia",
    "solucao_provisoria",
    "solucao_estrutural",
    "descricao_problema",
    "solucao_imediata",
    "publico_indicado",
    "ativo"
  ]),
  atualizarSolucao
);
router.patch("/:id/ativo", validateIdParam(), validateRequiredFields(["ativo"]), atualizarAtivo);

module.exports = router;
