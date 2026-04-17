const db = require("../config/db");
const {
  buildInsertQuery,
  buildUpdateQuery,
  buildWhereClause,
  pickDefined
} = require("./queryHelpers");

const TABLE = "solicitacoes";
const ID_COLUMN = "idsolicitacoes";
const CREATE_FIELDS = [
  "canal",
  "tipo_barreira",
  "urgencia",
  "area_responsavel",
  "precisa_profissional",
  "confianca_ia",
  "classificacao_ia_json",
  "atualizado_em",
  "criado_em",
  "descricao_dificuldade",
  "descricao_original",
  "contexto_problema",
  "impacto_trabalho",
  "preferencia_comunicacao",
  "apoio_imediato",
  "prioridade",
  "sla_resposta_horas",
  "sla_resolucao_horas",
  "data_primeira_resposta",
  "data_resolucao",
  "usuarios_idusuarios"
];
const UPDATE_FIELDS = [
  "canal",
  "tipo_barreira",
  "urgencia",
  "area_responsavel",
  "precisa_profissional",
  "confianca_ia",
  "classificacao_ia_json",
  "atualizado_em",
  "descricao_dificuldade",
  "descricao_original",
  "contexto_problema",
  "impacto_trabalho",
  "preferencia_comunicacao",
  "apoio_imediato",
  "prioridade",
  "sla_resposta_horas",
  "sla_resolucao_horas",
  "data_primeira_resposta",
  "data_resolucao",
  "usuarios_idusuarios"
];

const listar = async (filters = {}) => {
  const where = buildWhereClause(pickDefined(filters, [
    "canal",
    "tipo_barreira",
    "urgencia",
    "prioridade",
    "area_responsavel",
    "usuarios_idusuarios",
    "apoio_imediato"
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
