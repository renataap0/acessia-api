const db = require("../config/db");
const { buildInsertQuery, pickDefined } = require("./queryHelpers");

const TABLE = "solucao_relacionada";
const ID_COLUMN = "idsolucao_relacionada";
const CREATE_FIELDS = [
  "similaridade",
  "aplicacao_solucao",
  "data_aplicacao",
  "solicitacoes_idsolicitacoes",
  "solucoes_idsolucoes"
];

const criar = async (payload) => {
  const data = pickDefined(payload, CREATE_FIELDS);
  const { sql, values } = buildInsertQuery(TABLE, data);
  const [result] = await db.query(sql, values);
  return result.insertId;
};

const listarPorSolicitacao = async (solicitacaoId) => {
  const [rows] = await db.query(
    `SELECT sr.*, s.titulo, s.tipo_barreira, s.area_responsavel
       FROM ${TABLE} sr
       LEFT JOIN solucoes s ON s.idsolucoes = sr.solucoes_idsolucoes
      WHERE sr.solicitacoes_idsolicitacoes = ?
      ORDER BY sr.${ID_COLUMN} DESC`,
    [solicitacaoId]
  );

  return rows;
};

module.exports = {
  criar,
  listarPorSolicitacao
};
