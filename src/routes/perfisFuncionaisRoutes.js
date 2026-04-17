const express = require("express");
const router = express.Router();
const {
  atualizarPerfilFuncional,
  buscarPerfilFuncionalPorId,
  criarPerfilFuncional,
  listarPerfisFuncionais
} = require("../controllers/perfisFuncionaisController");
const {
  validateAtLeastOneField,
  validateIdParam,
  validateRequiredFields
} = require("../middlewares/validate");

const perfilFields = [
  "habilidades_profissionais",
  "experiencias_anteriores",
  "facilidades_no_ambiente",
  "preferencias_de_comunicacao",
  "dificuldades_encontradas",
  "necessidades_de_adaptacao",
  "barreiras_impactantes",
  "barreiras_que_impactam_o_desempenho",
  "tipo_de_apoio_necessario"
];

router.get("/", listarPerfisFuncionais);
router.get("/:id", validateIdParam(), buscarPerfilFuncionalPorId);
router.post(
  "/",
  validateRequiredFields(["habilidades_profissionais", "preferencias_de_comunicacao"]),
  criarPerfilFuncional
);
router.put(
  "/:id",
  validateIdParam(),
  validateAtLeastOneField(perfilFields),
  atualizarPerfilFuncional
);

module.exports = router;
