const iaService = require("../services/iaService");
const asyncHandler = require("../middlewares/asyncHandler");

const triagemInteligente = asyncHandler(async (req, res) => {
  const classificacao = iaService.classificarTriagem(req.body.texto);
  res.json(classificacao);
});

module.exports = {
  triagemInteligente
};
