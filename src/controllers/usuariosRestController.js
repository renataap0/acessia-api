const usuariosService = require("../services/usuariosService");
const asyncHandler = require("../middlewares/asyncHandler");

const listarUsuarios = asyncHandler(async (req, res) => {
  const usuarios = await usuariosService.listarUsuarios();
  res.json({ sucesso: true, dados: usuarios });
});

const buscarUsuarioPorId = asyncHandler(async (req, res) => {
  const usuario = await usuariosService.buscarUsuarioPorId(req.params.id);
  res.json({ sucesso: true, dados: usuario });
});

const criarUsuario = asyncHandler(async (req, res) => {
  const id = await usuariosService.criarUsuario(req.body);
  res.status(201).json({
    sucesso: true,
    mensagem: "Usuario criado com sucesso.",
    dados: { id }
  });
});

const atualizarUsuario = asyncHandler(async (req, res) => {
  const usuario = await usuariosService.atualizarUsuario(req.params.id, req.body);
  res.json({
    sucesso: true,
    mensagem: "Usuario atualizado com sucesso.",
    dados: usuario
  });
});

module.exports = {
  atualizarUsuario,
  buscarUsuarioPorId,
  criarUsuario,
  listarUsuarios
};
