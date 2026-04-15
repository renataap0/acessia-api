const db = require("../config/db");
const { buildInsertQuery, pickDefined } = require("./queryHelpers");

const TABLE = "arquivos";
const ID_COLUMN = "idarquivos";
const CREATE_FIELDS = [
  "nome_original",
  "caminho_arquivo",
  "mime_type",
  "tamanho_bytes",
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
