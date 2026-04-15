const usuariosQueries = require("../queries/usuariosQueries");
const AppError = require("../utils/AppError");
const { normalizeDate } = require("../utils/normalize");

const listarUsuarios = () => usuariosQueries.listar();

const buscarUsuarioPorId = async (id) => {
  const usuario = await usuariosQueries.buscarPorId(id);

  if (!usuario) {
    throw new AppError("Usuario nao encontrado.", 404);
  }

  return usuario;
};

const criarUsuario = async (payload) => {
  return usuariosQueries.criar({
    ...payload,
    created_at: normalizeDate(payload.created_at)
  });
};

const atualizarUsuario = async (id, payload) => {
  const affectedRows = await usuariosQueries.atualizar(id, payload);

  if (affectedRows === 0) {
    throw new AppError("Usuario nao encontrado.", 404);
  }

  return buscarUsuarioPorId(id);
};

module.exports = {
  atualizarUsuario,
  buscarUsuarioPorId,
  criarUsuario,
  listarUsuarios
};
