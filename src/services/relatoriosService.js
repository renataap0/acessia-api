const dashboardService = require("./dashboardService");

const buscarIndicadoresGerais = () => {
  return dashboardService.buscarIndicadores();
};

module.exports = {
  buscarIndicadoresGerais
};
