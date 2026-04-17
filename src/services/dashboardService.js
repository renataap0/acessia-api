const dashboardQueries = require("../queries/dashboardQueries");

const buscarResumo = () => {
  return dashboardQueries.resumo();
};

const buscarBarreiras = () => {
  return dashboardQueries.barreiras();
};

const buscarTempoMedio = () => {
  return dashboardQueries.tempoMedio();
};

const buscarIndicadores = () => {
  return dashboardQueries.indicadores();
};

module.exports = {
  buscarBarreiras,
  buscarIndicadores,
  buscarResumo,
  buscarTempoMedio
};
