const db = require("../config/db");

const resumo = async () => {
  const [[solicitacoes]] = await db.query(
    `SELECT
       COUNT(*) AS total_solicitacoes,
       SUM(CASE WHEN apoio_imediato = 1 THEN 1 ELSE 0 END) AS total_apoio_imediato,
       COUNT(DISTINCT usuarios_idusuarios) AS usuarios_com_solicitacao,
       AVG(confianca_ia) AS confianca_media_ia
     FROM solicitacoes`
  );
  const [[solucoes]] = await db.query(
    `SELECT
       COUNT(*) AS total_solucoes,
       SUM(CASE WHEN ativo = 1 THEN 1 ELSE 0 END) AS solucoes_ativas
     FROM solucoes`
  );
  const [[matches]] = await db.query(
    `SELECT COUNT(*) AS total_matches FROM matches`
  );

  return {
    total_solicitacoes: solicitacoes.total_solicitacoes,
    total_apoio_imediato: Number(solicitacoes.total_apoio_imediato || 0),
    usuarios_com_solicitacao: solicitacoes.usuarios_com_solicitacao,
    confianca_media_ia: Number(Number(solicitacoes.confianca_media_ia || 0).toFixed(2)),
    total_solucoes: solucoes.total_solucoes,
    solucoes_ativas: Number(solucoes.solucoes_ativas || 0),
    total_matches: matches.total_matches
  };
};

const barreiras = async () => {
  const [rows] = await db.query(
    `SELECT
       tipo_barreira,
       COUNT(*) AS total,
       AVG(confianca_ia) AS confianca_media_ia,
       AVG(sla_resposta_horas) AS sla_resposta_medio_horas,
       AVG(sla_resolucao_horas) AS sla_resolucao_medio_horas
     FROM solicitacoes
     GROUP BY tipo_barreira
     ORDER BY total DESC`
  );

  return rows.map((row) => ({
    ...row,
    confianca_media_ia: Number(Number(row.confianca_media_ia || 0).toFixed(2)),
    sla_resposta_medio_horas: Number(Number(row.sla_resposta_medio_horas || 0).toFixed(2)),
    sla_resolucao_medio_horas: Number(Number(row.sla_resolucao_medio_horas || 0).toFixed(2))
  }));
};

const tempoMedioGeral = async () => {
  const [[row]] = await db.query(
    `SELECT
       AVG(TIMESTAMPDIFF(MINUTE, criado_em, data_primeira_resposta)) / 60 AS tempo_medio_resposta_horas,
       AVG(TIMESTAMPDIFF(MINUTE, criado_em, data_resolucao)) / 60 AS tempo_medio_resolucao_horas
     FROM solicitacoes`
  );

  return {
    tempo_medio_resposta_horas: Number(Number(row.tempo_medio_resposta_horas || 0).toFixed(2)),
    tempo_medio_resolucao_horas: Number(Number(row.tempo_medio_resolucao_horas || 0).toFixed(2))
  };
};

const tempoMedioPorArea = async () => {
  const [rows] = await db.query(
    `SELECT
       area_responsavel,
       COUNT(*) AS total,
       AVG(TIMESTAMPDIFF(MINUTE, criado_em, data_primeira_resposta)) / 60 AS tempo_medio_resposta_horas,
       AVG(TIMESTAMPDIFF(MINUTE, criado_em, data_resolucao)) / 60 AS tempo_medio_resolucao_horas
     FROM solicitacoes
     GROUP BY area_responsavel
     ORDER BY tempo_medio_resolucao_horas DESC`
  );

  return rows.map((row) => ({
    ...row,
    tempo_medio_resposta_horas: Number(Number(row.tempo_medio_resposta_horas || 0).toFixed(2)),
    tempo_medio_resolucao_horas: Number(Number(row.tempo_medio_resolucao_horas || 0).toFixed(2))
  }));
};

const tempoMedio = async () => {
  const [geral, porArea] = await Promise.all([
    tempoMedioGeral(),
    tempoMedioPorArea()
  ]);

  return {
    geral,
    por_area: porArea
  };
};

const indicadores = async () => {
  const [dadosResumo, dadosBarreiras, dadosTempoMedio] = await Promise.all([
    resumo(),
    barreiras(),
    tempoMedio()
  ]);

  return {
    resumo: dadosResumo,
    barreiras: dadosBarreiras,
    tempo_medio: dadosTempoMedio
  };
};

module.exports = {
  barreiras,
  indicadores,
  resumo,
  tempoMedio
};
