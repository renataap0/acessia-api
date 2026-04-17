const dashboardService = require("../services/dashboardService");
const asyncHandler = require("../middlewares/asyncHandler");

const indicadores = asyncHandler(async (req, res) => {
  const dados = await dashboardService.buscarIndicadores();
  res.json({ sucesso: true, dados });
});

module.exports = {
  indicadores
};
