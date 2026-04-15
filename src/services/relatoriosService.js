const relatoriosQueries = require("../queries/relatoriosQueries");

const buscarIndicadoresGerais = () => {
  return relatoriosQueries.indicadoresGerais();
};

module.exports = {
  buscarIndicadoresGerais
};
