const express = require("express");
const router = express.Router();
const {
  atualizarUsuario,
  listarUsuarios,
  buscarUsuarioPorId,
  criarUsuario
} = require("../controllers/usuariosRestController");
const {
  validateAtLeastOneField,
  validateIdParam,
  validateRequiredFields
} = require("../middlewares/validate");

router.get("/", listarUsuarios);
router.get("/:id", validateIdParam(), buscarUsuarioPorId);
router.post("/", validateRequiredFields(["nome", "email", "tipo_usuario"]), criarUsuario);
router.put(
  "/:id",
  validateIdParam(),
  validateAtLeastOneField(["nome", "email", "tipo_usuario", "unidade", "cargo"]),
  atualizarUsuario
);

module.exports = router;
