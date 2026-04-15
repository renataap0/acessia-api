const db = require("../config/db");
const { buildInsertQuery, buildUpdateQuery, pickDefined } = require("./queryHelpers");

const TABLE = "encaminhamento";
const ID_COLUMN = "idencaminhamento";
const CREATE_FIELDS = [
  "observacao",
  "profissional_responsavel",
  "criado_em",
  "solicitacoes_idsolicitacoes"
];
const UPDATE_FIELDS = ["observacao", "profissional_responsavel"];

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

const atualizar = async (id, payload) => {
  const data = pickDefined(payload, UPDATE_FIELDS);
  const { sql, values } = buildUpdateQuery(TABLE, ID_COLUMN, id, data);
  const [result] = await db.query(sql, values);
  return result.affectedRows;
};

module.exports = {
  atualizar,
  criar,
  listarPorSolicitacao
};
