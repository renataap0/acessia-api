const db = require("../config/db");
const {
  buildInsertQuery,
  buildUpdateQuery,
  buildWhereClause,
  pickDefined
} = require("./queryHelpers");

const TABLE = "vagas";
const ID_COLUMN = "idvagas";
const FIELDS = [
  "titulo",
  "area",
  "exigencias_do_cargo",
  "rotina_da_funcao",
  "ambiente_de_trabalho",
  "ferramentas_utilizadas",
  "barreiras_potenciais",
  "possibilidade_de_adaptacao",
  "ativo"
];

const listar = async (filters = {}) => {
  const where = buildWhereClause(pickDefined(filters, ["area", "ativo"]));
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

const buscarPorIds = async (ids) => {
  if (!ids.length) {
    return [];
  }

  const placeholders = ids.map(() => "?").join(", ");
  const [rows] = await db.query(
    `SELECT * FROM ${TABLE} WHERE ${ID_COLUMN} IN (${placeholders}) ORDER BY ${ID_COLUMN} DESC`,
    ids
  );

  return rows;
};

const criar = async (payload) => {
  const data = pickDefined(payload, FIELDS);
  const { sql, values } = buildInsertQuery(TABLE, data);
  const [result] = await db.query(sql, values);
  return result.insertId;
};

const atualizar = async (id, payload) => {
  const data = pickDefined(payload, FIELDS);
  const { sql, values } = buildUpdateQuery(TABLE, ID_COLUMN, id, data);
  const [result] = await db.query(sql, values);
  return result.affectedRows;
};

module.exports = {
  atualizar,
  buscarPorId,
  buscarPorIds,
  criar,
  listar
};
