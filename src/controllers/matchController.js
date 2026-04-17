const matchService = require("../services/matchService");
const asyncHandler = require("../middlewares/asyncHandler");

const avaliar = asyncHandler(async (req, res) => {
  const resultado = await matchService.avaliarMatch(req.body);
  res.status(201).json({
    sucesso: true,
    mensagem: "Avaliacao de match criada com sucesso.",
    dados: resultado
  });
});

const buscarPorId = asyncHandler(async (req, res) => {
  const avaliacao = await matchService.buscarMatchPorId(req.params.id);
  res.json({ sucesso: true, dados: avaliacao });
});

module.exports = {
  avaliar,
  buscarPorId
};
