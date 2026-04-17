const db = require("../config/db");

const TABLE = "matches";
const ID_COLUMN = "idmatches";

const criar = async ({
  pontuacao_compatibilidade,
  areas_recomendadas,
  adaptacoes_recomendadas,
  riscos_incompatibilidade,
  justificativa,
  plano_inicial_acolhimento,
  perfis_funcionais_idperfis_funcionais,
  vagas_idvagas
}) => {
  const [result] = await db.query(
    `INSERT INTO ${TABLE}
      (
        pontuacao_compatibilidade,
        areas_recomendadas,
        adaptacoes_recomendadas,
        riscos_incompatibilidade,
        justificativa,
        plano_inicial_acolhimento,
        perfis_funcionais_idperfis_funcionais,
        vagas_idvagas
      )
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      pontuacao_compatibilidade,
      areas_recomendadas,
      adaptacoes_recomendadas,
      riscos_incompatibilidade,
      justificativa,
      plano_inicial_acolhimento,
      perfis_funcionais_idperfis_funcionais,
      vagas_idvagas
    ]
  );

  return result.insertId;
};

const listar = async () => {
  const [rows] = await db.query(
    `SELECT
       m.*,
       v.titulo AS vaga_titulo,
       v.area AS vaga_area
     FROM ${TABLE} m
     LEFT JOIN vagas v ON v.idvagas = m.vagas_idvagas
     ORDER BY m.${ID_COLUMN} DESC`
  );

  return rows;
};

const buscarPorId = async (id) => {
  const [rows] = await db.query(
    `SELECT
       m.*,
       v.titulo AS vaga_titulo,
       v.area AS vaga_area
     FROM ${TABLE} m
     LEFT JOIN vagas v ON v.idvagas = m.vagas_idvagas
     WHERE m.${ID_COLUMN} = ?`,
    [id]
  );

  return rows[0] || null;
};

module.exports = {
  buscarPorId,
  criar,
  listar
};
