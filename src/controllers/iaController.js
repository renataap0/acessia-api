const iaService = require("../services/iaService");
const asyncHandler = require("../middlewares/asyncHandler");

const classificar = asyncHandler(async (req, res) => {
  const metadados = {
    ...(req.body.metadados || {}),
    contexto: req.body.contexto
  };
  const classificacao = iaService.classificarTexto(req.body.texto, metadados);
  res.json({ sucesso: true, dados: classificacao });
});

const triagemInteligente = asyncHandler(async (req, res) => {
  const metadados = {
    ...(req.body.metadados || {}),
    contexto: req.body.contexto
  };
  const classificacao = iaService.classificarTriagem(req.body.texto, metadados);
  res.json({ sucesso: true, dados: classificacao });
});

module.exports = {
  classificar,
  triagemInteligente
};
