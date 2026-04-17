const iaService = require("../services/iaService");
const asyncHandler = require("../middlewares/asyncHandler");

const classificar = asyncHandler(async (req, res) => {
  const classificacao = iaService.classificarTexto(req.body.texto, req.body.metadados);
  res.json({ sucesso: true, dados: classificacao });
});

const triagemInteligente = asyncHandler(async (req, res) => {
  const classificacao = iaService.classificarTriagem(req.body.texto, req.body.metadados);
  res.json({ sucesso: true, dados: classificacao });
});

module.exports = {
  classificar,
  triagemInteligente
};
