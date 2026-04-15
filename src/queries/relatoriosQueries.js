const db = require("../config/db");

const groupBy = async (table, column) => {
  const [rows] = await db.query(
    `SELECT ${column} AS categoria, COUNT(*) AS total
       FROM ${table}
      GROUP BY ${column}
      ORDER BY total DESC`
  );

  return rows;
};

const contar = async (table, where = "") => {
  const [[row]] = await db.query(`SELECT COUNT(*) AS total FROM ${table} ${where}`);
  return row.total;
};

const indicadoresGerais = async () => {
  const [
    totalSolicitacoes,
    solicitacoesPorStatus,
    solicitacoesPorBarreira,
    solicitacoesPorArea,
    solucoesAtivas,
    solucoesInativas
  ] = await Promise.all([
    contar("solicitacoes"),
    groupBy("solicitacoes", "status"),
    groupBy("solicitacoes", "tipo_barreira"),
    groupBy("solicitacoes", "area_responsavel"),
    contar("solucoes", "WHERE ativo = 1"),
    contar("solucoes", "WHERE ativo = 0")
  ]);

  return {
    total_solicitacoes: totalSolicitacoes,
    solicitacoes_por_status: solicitacoesPorStatus,
    solicitacoes_por_barreira: solicitacoesPorBarreira,
    solicitacoes_por_area: solicitacoesPorArea,
    solucoes_ativas: solucoesAtivas,
    solucoes_inativas: solucoesInativas
  };
};

module.exports = {
  indicadoresGerais
};
