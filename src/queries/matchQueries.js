const db = require("../config/db");
const { toJsonString } = require("../utils/normalize");

const TABLE = "match_avaliacoes";

const criar = async ({ perfis_funcionais_idperfis_funcionais, entrada_json, resultado_json }) => {
  const [result] = await db.query(
    `INSERT INTO ${TABLE}
      (perfis_funcionais_idperfis_funcionais, entrada_json, resultado_json)
     VALUES (?, ?, ?)`,
    [
      perfis_funcionais_idperfis_funcionais || null,
      toJsonString(entrada_json),
      toJsonString(resultado_json)
    ]
  );

  return result.insertId;
};

const buscarPorId = async (id) => {
  const [rows] = await db.query(
    `SELECT * FROM ${TABLE} WHERE idmatch_avaliacoes = ?`,
    [id]
  );

  return rows[0] || null;
};

module.exports = {
  buscarPorId,
  criar
};
