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
    "solucao_provisoria",
    "contexto_problema",
    "tipo_barreira",
    "acao_recomendada",
    "area_responsavel",
    "custo_estimado",
    "prazo_estimado_dias"
  ]),
  criarSolucao
);
router.put(
  "/:id",
  validateIdParam(),
  validateAtLeastOneField([
    "solucao_provisoria",
    "contexto_problema",
    "urgencia",
    "tipo_barreira",
    "acao_recomendada",
    "area_responsavel",
    "ativo",
    "solucao_estrutural",
    "custo_estimado",
    "prazo_estimado_dias"
  ]),
  atualizarSolucao
);
router.patch("/:id/ativo", validateIdParam(), validateRequiredFields(["ativo"]), atualizarAtivo);

module.exports = router;
