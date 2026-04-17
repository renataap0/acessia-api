const dashboardQueries = require("../queries/dashboardQueries");

const buscarIndicadores = () => {
  return dashboardQueries.indicadores();
};

module.exports = {
  buscarIndicadores
};
