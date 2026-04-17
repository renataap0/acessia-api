const db = require("../config/db");
const { buildInsertQuery, pickDefined } = require("./queryHelpers");

const TABLE = "feedbacks";
const ID_COLUMN = "idfeedbacks";
const CREATE_FIELDS = [
  "funcionou",
  "nota",
  "nota_satisfacao",
  "comentario",
  "criado_em",
  "solicitacoes_idsolicitacoes",
  "usuarios_idusuarios"
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
