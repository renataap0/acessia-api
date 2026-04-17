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
  "usuarios_idusuarios",
  "canal",
  "tipo_barreira",
  "dificuldade_encontrada",
  "contexto",
  "impacto_trabalho",
  "descricao",
  "urgencia",
  "prioridade",
  "preferencia_comunicacao",
  "necessidade_apoio_imediato",
  "area_responsavel",
  "status",
  "precisa_profissional",
  "confianca_ia",
  "classificacao_inicial_ia",
  "classificacao_ia_json",
  "sla_horas",
  "prazo_sla",
  "data_primeira_resposta",
  "data_resolucao",
  "recorrencia_chave",
  "criado_em",
  "atualizado_em"
];
const UPDATE_FIELDS = [
  "usuarios_idusuarios",
  "canal",
  "tipo_barreira",
  "dificuldade_encontrada",
  "contexto",
  "impacto_trabalho",
  "descricao",
  "urgencia",
  "prioridade",
  "preferencia_comunicacao",
  "necessidade_apoio_imediato",
  "area_responsavel",
  "status",
  "precisa_profissional",
  "confianca_ia",
  "classificacao_inicial_ia",
  "classificacao_ia_json",
  "sla_horas",
  "prazo_sla",
  "data_primeira_resposta",
  "data_resolucao",
  "recorrencia_chave",
  "atualizado_em"
];

const listar = async (filters = {}) => {
  const where = buildWhereClause(pickDefined(filters, [
    "canal",
    "tipo_barreira",
    "urgencia",
    "prioridade",
    "area_responsavel",
    "status",
    "usuarios_idusuarios",
    "necessidade_apoio_imediato"
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
