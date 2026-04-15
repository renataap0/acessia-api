const db = require("../config/db");
const { buildInsertQuery, pickDefined } = require("./queryHelpers");

const TABLE = "logs_ia";
const ID_COLUMN = "idlogs_ia";
const CREATE_FIELDS = [
  "entrada",
  "saida",
  "modelo",
  "confianca",
  "criado_em",
  "solicitacoes_idsolicitacoes"
];

const criar = async (payload) => {
  const data = pickDefined(payload, CREATE_FIELDS);
  const { sql, values } = buildInsertQuery(TABLE, data);
  const [result] = await db.query(sql, values);
  return result.insertId;
};

const listarPorSolicitacao = async (solicitacaoId) => {
  const [rows] = await db.query(
    `SELECT * FROM ${TABLE} WHERE solicitacoes_idsolicitacoes = ? ORDER BY ${ID_COLUMN} DESC`,
    [solicitacaoId]
  );
  return rows;
};

module.exports = {
  criar,
  listarPorSolicitacao
};
