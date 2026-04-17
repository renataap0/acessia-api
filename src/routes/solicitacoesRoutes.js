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
    "descricao_dificuldade",
    "contexto_problema",
    "impacto_trabalho",
    "preferencia_comunicacao",
    "usuarios_idusuarios"
  ]),
  criarSolicitacao
);
router.put(
  "/:id",
  validateIdParam(),
  validateAtLeastOneField([
    "canal",
    "tipo_barreira",
    "descricao_dificuldade",
    "descricao_original",
    "contexto_problema",
    "impacto_trabalho",
    "urgencia",
    "prioridade",
    "preferencia_comunicacao",
    "apoio_imediato",
    "area_responsavel",
    "precisa_profissional",
    "classificacao_ia_json",
    "sla_resposta_horas",
    "sla_resolucao_horas",
    "data_primeira_resposta",
    "data_resolucao",
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
