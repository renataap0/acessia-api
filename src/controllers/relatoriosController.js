const relatoriosService = require("../services/relatoriosService");
const asyncHandler = require("../middlewares/asyncHandler");

const indicadoresGerais = asyncHandler(async (req, res) => {
  const indicadores = await relatoriosService.buscarIndicadoresGerais();
  res.json({ sucesso: true, dados: indicadores });
});

module.exports = {
  indicadoresGerais
};
