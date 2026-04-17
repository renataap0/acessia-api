const perfisFuncionaisService = require("../services/perfisFuncionaisService");
const asyncHandler = require("../middlewares/asyncHandler");

const listarPerfisFuncionais = asyncHandler(async (req, res) => {
  const perfis = await perfisFuncionaisService.listarPerfisFuncionais(req.query);
  res.json({ sucesso: true, dados: perfis });
});

const buscarPerfilFuncionalPorId = asyncHandler(async (req, res) => {
  const perfil = await perfisFuncionaisService.buscarPerfilFuncionalPorId(req.params.id);
  res.json({ sucesso: true, dados: perfil });
});

const criarPerfilFuncional = asyncHandler(async (req, res) => {
  const id = await perfisFuncionaisService.criarPerfilFuncional(req.body);
  res.status(201).json({
    sucesso: true,
    mensagem: "Perfil funcional criado com sucesso.",
    dados: { id }
  });
});

const atualizarPerfilFuncional = asyncHandler(async (req, res) => {
  const perfil = await perfisFuncionaisService.atualizarPerfilFuncional(req.params.id, req.body);
  res.json({
    sucesso: true,
    mensagem: "Perfil funcional atualizado com sucesso.",
    dados: perfil
  });
});

module.exports = {
  atualizarPerfilFuncional,
  buscarPerfilFuncionalPorId,
  criarPerfilFuncional,
  listarPerfisFuncionais
};
