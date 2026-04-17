const db = require("../config/db");
const {
  buildInsertQuery,
  buildUpdateQuery,
  buildWhereClause,
  pickDefined
} = require("./queryHelpers");

const TABLE = "perfis_funcionais";
const ID_COLUMN = "idperfis_funcionais";
const FIELDS = [
  "usuarios_idusuarios",
  "identificador",
  "habilidades_profissionais",
  "experiencias_anteriores",
  "facilidades_no_ambiente",
  "dificuldades_encontradas",
  "preferencias_de_comunicacao",
  "necessidades_de_adaptacao",
  "barreiras_que_impactam_o_desempenho",
  "tipo_de_apoio_necessario",
  "ativo"
];

const listar = async (filters = {}) => {
  const where = buildWhereClause(pickDefined(filters, ["usuarios_idusuarios", "ativo"]));
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
  criar,
  listar
};
