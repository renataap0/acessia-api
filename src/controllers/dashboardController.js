const dashboardService = require("../services/dashboardService");
const asyncHandler = require("../middlewares/asyncHandler");

const indicadores = asyncHandler(async (req, res) => {
  const dados = await dashboardService.buscarIndicadores();
  res.json({ sucesso: true, dados });
});

const resumo = asyncHandler(async (req, res) => {
  const dados = await dashboardService.buscarResumo();
  res.json({ sucesso: true, dados });
});

const barreiras = asyncHandler(async (req, res) => {
  const dados = await dashboardService.buscarBarreiras();
  res.json({ sucesso: true, dados });
});

const tempoMedio = asyncHandler(async (req, res) => {
  const dados = await dashboardService.buscarTempoMedio();
  res.json({ sucesso: true, dados });
});

module.exports = {
  barreiras,
  resumo,
  tempoMedio,
  indicadores
};
