const db = require("../config/db");

const groupBySolicitacoes = async (column) => {
  const [rows] = await db.query(
    `SELECT ${column} AS categoria, COUNT(*) AS total
       FROM solicitacoes
      GROUP BY ${column}
      ORDER BY total DESC`
  );

  return rows;
};

const totalDemandasAbertas = async () => {
  const [[row]] = await db.query(
    `SELECT COUNT(*) AS total
       FROM solicitacoes
      WHERE status IN ('aberta', 'em_triagem', 'em_andamento', 'encaminhada')`
  );

  return row.total;
};

const tempoMedioResposta = async () => {
  const [[row]] = await db.query(
    `SELECT AVG(TIMESTAMPDIFF(MINUTE, criado_em, data_primeira_resposta)) / 60 AS horas
       FROM solicitacoes
      WHERE data_primeira_resposta IS NOT NULL`
  );

  return Number(row.horas || 0);
};

const tempoMedioResolucao = async () => {
  const [[row]] = await db.query(
    `SELECT AVG(TIMESTAMPDIFF(MINUTE, criado_em, data_resolucao)) / 60 AS horas
       FROM solicitacoes
      WHERE data_resolucao IS NOT NULL`
  );

  return Number(row.horas || 0);
};

const percentualResolvido = async () => {
  const [[row]] = await db.query(
    `SELECT
       COUNT(*) AS total,
       SUM(CASE WHEN status IN ('resolvida', 'concluida') THEN 1 ELSE 0 END) AS resolvidas
     FROM solicitacoes`
  );

  if (!row.total) {
    return 0;
  }

  return Number(((row.resolvidas / row.total) * 100).toFixed(2));
};

const reincidenciaPorBarreira = async () => {
  const [rows] = await db.query(
    `SELECT
       tipo_barreira,
       COUNT(*) AS total_casos,
       GREATEST(COUNT(*) - COUNT(DISTINCT COALESCE(recorrencia_chave, idsolicitacoes)), 0) AS recorrencias
     FROM solicitacoes
     GROUP BY tipo_barreira
     ORDER BY recorrencias DESC, total_casos DESC`
  );

  return rows;
};

const satisfacaoMedia = async () => {
  const [[row]] = await db.query(
    `SELECT AVG(COALESCE(NULLIF(nota, 0), nota_satisfacao)) AS media
       FROM feedbacks
      WHERE COALESCE(NULLIF(nota, 0), nota_satisfacao) IS NOT NULL`
  );

  return Number(Number(row.media || 0).toFixed(2));
};

const gargalosPorArea = async () => {
  const [rows] = await db.query(
    `SELECT
       area_responsavel,
       COUNT(*) AS total_abertas,
       SUM(CASE WHEN prazo_sla IS NOT NULL AND prazo_sla < NOW() THEN 1 ELSE 0 END) AS demandas_atrasadas,
       AVG(CASE
         WHEN data_primeira_resposta IS NOT NULL
         THEN TIMESTAMPDIFF(MINUTE, criado_em, data_primeira_resposta) / 60
         ELSE NULL
       END) AS tempo_medio_resposta_horas
     FROM solicitacoes
     WHERE status IN ('aberta', 'em_triagem', 'em_andamento', 'encaminhada')
     GROUP BY area_responsavel
     ORDER BY demandas_atrasadas DESC, total_abertas DESC`
  );

  return rows.map((row) => ({
    ...row,
    tempo_medio_resposta_horas: Number(Number(row.tempo_medio_resposta_horas || 0).toFixed(2))
  }));
};

const indicadores = async () => {
  const [
    abertas,
    porStatus,
    porTipoBarreira,
    respostaHoras,
    resolucaoHoras,
    resolvidoPercentual,
    reincidencias,
    satisfacao,
    gargalos
  ] = await Promise.all([
    totalDemandasAbertas(),
    groupBySolicitacoes("status"),
    groupBySolicitacoes("tipo_barreira"),
    tempoMedioResposta(),
    tempoMedioResolucao(),
    percentualResolvido(),
    reincidenciaPorBarreira(),
    satisfacaoMedia(),
    gargalosPorArea()
  ]);

  return {
    total_demandas_abertas: abertas,
    total_por_status: porStatus,
    total_por_tipo_barreira: porTipoBarreira,
    tempo_medio_resposta_horas: Number(respostaHoras.toFixed(2)),
    tempo_medio_resolucao_horas: Number(resolucaoHoras.toFixed(2)),
    percentual_resolvido: resolvidoPercentual,
    reincidencia_por_barreira: reincidencias,
    satisfacao_media: satisfacao,
    gargalos_por_area: gargalos
  };
};

module.exports = {
  indicadores
};
