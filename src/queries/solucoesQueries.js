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
  "solucao_provisoria",
  "contexto_problema",
  "urgencia",
  "tipo_barreira",
  "acao_recomendada",
  "area_responsavel",
  "ativo",
  "solucao_estrutural",
  "custo_estimado",
  "prazo_estimado_dias"
];
const UPDATE_FIELDS = [
  "solucao_provisoria",
  "contexto_problema",
  "urgencia",
  "tipo_barreira",
  "acao_recomendada",
  "area_responsavel",
  "ativo",
  "solucao_estrutural",
  "custo_estimado",
  "prazo_estimado_dias"
];

const listar = async (filters = {}) => {
  const where = buildWhereClause(pickDefined(filters, [
    "tipo_barreira",
    "area_responsavel",
    "urgencia",
    "ativo"
  ]));
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

const buscarRecomendadas = async ({ tipo_barreira, area_responsavel, limite = 3 }) => {
  const values = [tipo_barreira];
  let areaClause = "";

  if (area_responsavel) {
    areaClause = " AND area_responsavel = ?";
    values.push(area_responsavel);
  }

  values.push(Number(limite));

  const [rows] = await db.query(
    `SELECT *
       FROM ${TABLE}
      WHERE ativo = 1
        AND tipo_barreira = ?${areaClause}
      ORDER BY prazo_estimado_dias ASC, custo_estimado ASC
      LIMIT ?`,
    values
  );

  return rows;
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
  buscarRecomendadas,
  criar,
  listar
};
