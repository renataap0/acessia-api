const db = require("../config/db");
const { buildInsertQuery, buildUpdateQuery, pickDefined } = require("./queryHelpers");

const TABLE = "usuarios";
const ID_COLUMN = "idusuarios";
const CREATE_FIELDS = ["nome", "email", "tipo_usuario", "unidade", "cargo", "created_at"];
const UPDATE_FIELDS = ["nome", "email", "tipo_usuario", "unidade", "cargo"];

const listar = async () => {
  const [rows] = await db.query(`SELECT * FROM ${TABLE} ORDER BY ${ID_COLUMN} DESC`);
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
