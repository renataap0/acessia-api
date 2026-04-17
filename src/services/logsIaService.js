const logsIaQueries = require("../queries/logsIaQueries");
const { normalizeDate, toJsonString } = require("../utils/normalize");

const registrarLogIa = async (payload) => {
  const saida = payload.saida_classificacao || payload.saida || {};
  const saidaComMetadados = typeof saida === "string"
    ? saida
    : {
      ...saida,
      tipo_processo: payload.tipo_processo || "triagem"
    };

  return logsIaQueries.criar({
    ...payload,
    entrada_texto: payload.entrada_texto || payload.entrada,
    saida_classificacao: toJsonString(saidaComMetadados),
    modelo_utilizado: payload.modelo_utilizado || payload.modelo || "simulador_regras_v1",
    tempo_resposta: payload.tempo_resposta,
    tipo_processo: payload.tipo_processo || "triagem",
    created_at: normalizeDate(payload.created_at || payload.criado_em)
  });
};

const listarLogsPorSolicitacao = (solicitacaoId) => {
  return logsIaQueries.listarPorSolicitacao(solicitacaoId);
};

module.exports = {
  listarLogsPorSolicitacao,
  registrarLogIa
};
