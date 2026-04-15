const db = require("../config/db");

const TABLE = "solucoes_has_solicitacoes";

const vincular = async ({ solucoes_idsolucoes, solicitacoes_idsolicitacoes }) => {
  const [result] = await db.query(
    `INSERT INTO ${TABLE} (solucoes_idsolucoes, solicitacoes_idsolicitacoes) VALUES (?, ?)`,
    [solucoes_idsolucoes, solicitacoes_idsolicitacoes]
  );

  return result.affectedRows;
};

const listarPorSolicitacao = async (solicitacaoId) => {
  const [rows] = await db.query(
    `SELECT s.*
       FROM solucoes s
       INNER JOIN ${TABLE} shs ON shs.solucoes_idsolucoes = s.idsolucoes
      WHERE shs.solicitacoes_idsolicitacoes = ?
      ORDER BY s.idsolucoes DESC`,
    [solicitacaoId]
  );

  return rows;
};

module.exports = {
  listarPorSolicitacao,
  vincular
};
