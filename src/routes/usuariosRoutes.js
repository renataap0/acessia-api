const express = require("express");
const router = express.Router();
const {
  listarUsuarios,
  buscarUsuarioPorId,
  criarUsuario
} = require("../controllers/usuariosController");

router.get("/", listarUsuarios);
router.get("/:id", buscarUsuarioPorId);
router.post("/", criarUsuario);

module.exports = router;