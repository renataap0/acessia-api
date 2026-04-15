const express = require("express");
const router = express.Router();
const {
  associarUsuario,
  atualizarStatus,
  buscarSolicitacaoPorId,
  classificarUrgencia,
  criarSolicitacao,
  listarSolicitacoes
} = require("../controllers/solicitacoesRestController");
const { validateIdParam, validateRequiredFields } = require("../middlewares/validate");

router.get("/", listarSolicitacoes);
router.get("/:id", validateIdParam(), buscarSolicitacaoPorId);
router.post(
  "/",
  validateRequiredFields([
    "tipo_barreira",
    "urgencia",
    "area_responsavel",
    "usuarios_idusuarios"
  ]),
  criarSolicitacao
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
