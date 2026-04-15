const db = require("../config/db");
const {
  buildInsertQuery,
  buildUpdateQuery,
  buildWhereClause,
  pickDefined
} = require("./queryHelpers");

const TABLE = "solucoes";
const ID_COLUMN = "idsolucoes";
const CREATE_FIELDS = [
  "titulo",
  "descricao_problema",
  "solucao_imediata",
  "tipo_barreira",
  "publico_indicado",
  "area_responsavel",
  "ativo"
];
const UPDATE_FIELDS = [
  "titulo",
  "descricao_problema",
  "solucao_imediata",
  "tipo_barreira",
  "publico_indicado",
  "area_responsavel",
  "ativo"
];

const listar = async (filters = {}) => {
  const where = buildWhereClause(pickDefined(filters, ["tipo_barreira", "ativo"]));
  const [rows] = await db.query(
    `SELECT * FROM ${TABLE}${where.clause} ORDER BY ${ID_COLUMN} DESC`,
    where.values
  );
  return rows;
};

const buscarPorId = async (id) => {
  const [rows] = await db.query(`SELECT * FROM ${TABLE} WHERE ${ID_COLUMN} = ?`, [id]);
  return rows[0] || null;
};

const criar = async (payload) => {
  const data = pickDefined(payload, CREATE_FIELDS);
  const { sql, values } = buildInsertQuery(TABLE, data);
  const [result] = await db.query(sql, values);
  return result.insertId;
};

const atualizar = async (id, payload) => {
  const data = pickDefined(payload, UPDATE_FIELDS);
  const { sql, values } = buildUpdateQuery(TABLE, ID_COLUMN, id, data);
  const [result] = await db.query(sql, values);
  return result.affectedRows;
};

module.exports = {
  atualizar,
  buscarPorId,
  criar,
  listar
};
