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
  validateRequiredFields(["titulo", "solucao_imediata", "tipo_barreira"]),
  criarSolucao
);
router.put(
  "/:id",
  validateIdParam(),
  validateAtLeastOneField([
    "titulo",
    "descricao_problema",
    "solucao_imediata",
    "tipo_barreira",
    "publico_indicado",
    "area_responsavel",
    "ativo"
  ]),
  atualizarSolucao
);
router.patch("/:id/ativo", validateIdParam(), validateRequiredFields(["ativo"]), atualizarAtivo);

module.exports = router;
