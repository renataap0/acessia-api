const express = require("express");
const router = express.Router();
const {
  atualizarVaga,
  buscarVagaPorId,
  criarVaga,
  listarVagas
} = require("../controllers/vagasController");
const {
  validateAtLeastOneField,
  validateIdParam,
  validateRequiredFields
} = require("../middlewares/validate");

const vagaFields = [
  "titulo",
  "area",
  "exigencias_do_cargo",
  "rotina_da_funcao",
  "ambiente_de_trabalho",
  "ferramentas_utilizadas",
  "barreiras_potenciais",
  "possibilidade_de_adaptacao",
  "ativo"
];

router.get("/", listarVagas);
router.get("/:id", validateIdParam(), buscarVagaPorId);
router.post("/", validateRequiredFields(["titulo", "area"]), criarVaga);
router.put(
  "/:id",
  validateIdParam(),
  validateAtLeastOneField(vagaFields),
  atualizarVaga
);

module.exports = router;
