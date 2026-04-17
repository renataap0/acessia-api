const db = require("../config/db");
const { buildInsertQuery, pickDefined } = require("./queryHelpers");

const TABLE = "logs_ia";
const ID_COLUMN = "idlogs_ia";
const BASE_CREATE_FIELDS = [
  "entrada_texto",
  "saida_classificacao",
  "modelo_utilizado",
  "tempo_resposta",
  "tipo_processo",
  "created_at",
  "solicitacoes_idsolicitacoes"
];

let cachedColumns = null;

const getExistingFields = async () => {
  if (!cachedColumns) {
    const [rows] = await db.query(`SHOW COLUMNS FROM ${TABLE}`);
    cachedColumns = rows.map((row) => row.Field);
  }

  return BASE_CREATE_FIELDS.filter((field) => cachedColumns.includes(field));
};

const criar = async (payload) => {
  const fields = await getExistingFields();
  const data = pickDefined(payload, fields);
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
