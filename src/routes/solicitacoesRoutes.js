const express = require("express");
const router = express.Router();
const {
  associarUsuario,
  atualizarSolicitacao,
  atualizarStatus,
  buscarSolicitacaoPorId,
  classificarUrgencia,
  criarSolicitacao,
  listarSolicitacoes
} = require("../controllers/solicitacoesRestController");
const {
  validateAtLeastOneField,
  validateIdParam,
  validateRequiredFields
} = require("../middlewares/validate");

router.get("/", listarSolicitacoes);
router.get("/:id", validateIdParam(), buscarSolicitacaoPorId);
router.post(
  "/",
  validateRequiredFields([
    "canal",
    "tipo_barreira",
    "dificuldade_encontrada",
    "contexto",
    "impacto_trabalho",
    "urgencia",
    "area_responsavel",
    "preferencia_comunicacao"
  ]),
  criarSolicitacao
);
router.put(
  "/:id",
  validateIdParam(),
  validateAtLeastOneField([
    "canal",
    "tipo_barreira",
    "dificuldade_encontrada",
    "contexto",
    "impacto_trabalho",
    "urgencia",
    "prioridade",
    "preferencia_comunicacao",
    "necessidade_apoio_imediato",
    "area_responsavel",
    "status",
    "precisa_profissional",
    "classificacao_ia_json",
    "sla_horas",
    "prazo_sla",
    "recorrencia_chave",
    "usuarios_idusuarios"
  ]),
  atualizarSolicitacao
);
router.patch("/:id/status", validateIdParam(), validateRequiredFields(["status"]), atualizarStatus);
router.patch(
  "/:id/urgencia",
  validateIdParam(),
  validateRequiredFields(["urgencia"]),
  classificarUrgencia
);
router.patch(
  "/:id/usuario",
  validateIdParam(),
  validateRequiredFields(["usuarios_idusuarios"]),
  associarUsuario
);

module.exports = router;
