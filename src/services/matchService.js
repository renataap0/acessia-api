const matchQueries = require("../queries/matchQueries");
const logsIaService = require("./logsIaService");
const perfisFuncionaisService = require("./perfisFuncionaisService");
const vagasService = require("./vagasService");
const AppError = require("../utils/AppError");
const { normalizeSearchText } = require("../utils/domain");

const STOPWORDS = new Set([
  "para", "com", "sem", "por", "das", "dos", "uma", "que",
  "de", "da", "do", "em", "as", "os", "ao", "ou", "e"
]);

const adaptacoesPorBarreira = {
  comunicacao: "Usar comunicacao escrita, pauta previa, legenda e resumo objetivo.",
  mobilidade: "Garantir rota acessivel, posto adequado e deslocamento seguro.",
  sensorial: "Reduzir ruido/luz, prever pausas e posto com menor estimulo.",
  digital: "Validar sistemas com acessibilidade e manter canal alternativo temporario.",
  organizacional: "Criar checklist, rotina clara, prioridades explicitas e acompanhamento inicial.",
  atitudinal: "Orientar lideranca/equipe e manter canal seguro de acompanhamento."
};

const parseText = (value) => {
  if (Array.isArray(value)) {
    return value.join(" ");
  }

  if (value && typeof value === "object") {
    return Object.values(value).map(parseText).join(" ");
  }

  return String(value || "");
};

const unique = (items) => [...new Set(items.filter(Boolean))];

const tokenize = (text) => {
  return unique(
    normalizeSearchText(text)
      .split(/[^a-z0-9]+/)
      .filter((token) => token.length > 3 && !STOPWORDS.has(token))
  );
};

const intersection = (left, right) => {
  const rightSet = new Set(right);
  return left.filter((item) => rightSet.has(item));
};

const detectBarriers = (text) => {
  const normalized = normalizeSearchText(text);

  return Object.keys(adaptacoesPorBarreira).filter((barreira) => (
    normalized.includes(barreira)
  ));
};

const textFromFields = (entity, fields) => {
  return fields.map((field) => parseText(entity[field])).join(" ");
};

const resolvePerfil = async (payload) => {
  const perfilId = payload.perfil_funcional_id ||
    payload.perfis_funcionais_idperfis_funcionais ||
    payload.perfil_funcional?.idperfis_funcionais;

  if (perfilId && !payload.perfil_funcional) {
    return {
      perfil: await perfisFuncionaisService.buscarPerfilFuncionalPorId(perfilId),
      perfilId: Number(perfilId)
    };
  }

  if (payload.perfil_funcional || payload.perfil) {
    return {
      perfil: payload.perfil_funcional || payload.perfil,
      perfilId: perfilId ? Number(perfilId) : null
    };
  }

  throw new AppError("Informe perfil_funcional ou perfil_funcional_id.", 400);
};

const resolveVaga = async (payload) => {
  const vagaId = payload.vaga_id ||
    payload.vagas_idvagas ||
    payload.vaga?.idvagas;

  if (vagaId && !payload.vaga) {
    return {
      vaga: await vagasService.buscarVagaPorId(vagaId),
      vagaId: Number(vagaId)
    };
  }

  if (payload.vaga) {
    return {
      vaga: payload.vaga,
      vagaId: vagaId ? Number(vagaId) : null
    };
  }

  throw new AppError("Informe vaga ou vaga_id.", 400);
};

const avaliarCompatibilidade = (perfil, vaga) => {
  const perfilCompetencias = textFromFields(perfil, [
    "habilidades_profissionais",
    "experiencias_anteriores",
    "facilidades_no_ambiente"
  ]);
  const vagaRequisitos = textFromFields(vaga, [
    "titulo",
    "area",
    "exigencias_do_cargo",
    "rotina_da_funcao",
    "ferramentas_utilizadas"
  ]);
  const perfilBarreirasTexto = textFromFields(perfil, [
    "dificuldades_encontradas",
    "necessidades_de_adaptacao",
    "barreiras_impactantes",
    "barreiras_que_impactam_o_desempenho"
  ]);
  const vagaBarreirasTexto = textFromFields(vaga, [
    "ambiente_de_trabalho",
    "barreiras_potenciais",
    "rotina_da_funcao"
  ]);

  const competenciasEmComum = intersection(tokenize(perfilCompetencias), tokenize(vagaRequisitos));
  const barreirasPerfil = detectBarriers(perfilBarreirasTexto);
  const barreirasVaga = detectBarriers(vagaBarreirasTexto);
  const barreirasEmRisco = intersection(barreirasPerfil, barreirasVaga);
  const adaptavel = /alta|media|adapt|flex|ajuste|possibilidade/i.test(
    parseText(vaga.possibilidade_de_adaptacao)
  );
  const pontosCompetencia = Math.min(35, competenciasEmComum.length * 7);
  const bonusAdaptacao = adaptavel ? 15 : 0;
  const penalidadeBarreira = barreirasEmRisco.length * 12;
  const pontuacao = Math.max(0, Math.min(100, 50 + pontosCompetencia + bonusAdaptacao - penalidadeBarreira));
  const barreirasParaAdaptar = unique([...barreirasPerfil, ...barreirasEmRisco]);
  const adaptacoes = barreirasParaAdaptar.map((barreira) => adaptacoesPorBarreira[barreira]);
  const riscos = barreirasEmRisco.map((barreira) => (
    `${barreira}: barreira tambem aparece no perfil e na vaga; exige acompanhamento humano.`
  ));

  return {
    pontuacao_compatibilidade: Number(pontuacao.toFixed(2)),
    areas_recomendadas: unique([vaga.area, vaga.titulo]).filter(Boolean),
    adaptacoes_recomendadas: unique(adaptacoes),
    riscos,
    justificativa: `Compatibilidade calculada por ${competenciasEmComum.length} termos profissionais em comum, ${barreirasEmRisco.length} barreiras de risco e possibilidade de adaptacao da vaga.`,
    competencias_em_comum: competenciasEmComum
  };
};

const listarMatches = async () => {
  return matchQueries.listar();
};

const avaliarMatch = async (payload) => {
  const inicio = process.hrtime.bigint();
  const { perfil, perfilId } = await resolvePerfil(payload);
  const { vaga, vagaId } = await resolveVaga(payload);
  const avaliacao = avaliarCompatibilidade(perfil, vaga);
  const tempoResposta = Number((Number(process.hrtime.bigint() - inicio) / 1e9).toFixed(3));
  let id = null;

  if (perfilId && vagaId) {
    id = await matchQueries.criar({
      pontuacao_compatibilidade: avaliacao.pontuacao_compatibilidade,
      areas_recomendadas: JSON.stringify(avaliacao.areas_recomendadas),
      adaptacoes_recomendadas: JSON.stringify(avaliacao.adaptacoes_recomendadas),
      riscos_incompatibilidade: JSON.stringify(avaliacao.riscos),
      justificativa: avaliacao.justificativa,
      plano_inicial_acolhimento: JSON.stringify([
        "Confirmar preferencias e adaptacoes com a pessoa.",
        "Alinhar gestor responsavel e canal de acompanhamento.",
        "Revisar barreiras percebidas nos primeiros 15 dias."
      ]),
      perfis_funcionais_idperfis_funcionais: perfilId,
      vagas_idvagas: vagaId
    });
  }

  if (payload.solicitacoes_idsolicitacoes) {
    await logsIaService.registrarLogIa({
      entrada_texto: JSON.stringify({ perfil_funcional: perfil, vaga }),
      saida_classificacao: avaliacao,
      modelo_utilizado: "simulador_regras_v1",
      tempo_resposta: tempoResposta,
      tipo_processo: "match",
      solicitacoes_idsolicitacoes: payload.solicitacoes_idsolicitacoes
    });
  }

  return {
    idmatches: id,
    ...avaliacao
  };
};

const buscarMatchPorId = async (id) => {
  const avaliacao = await matchQueries.buscarPorId(id);

  if (!avaliacao) {
    throw new AppError("Match nao encontrado.", 404);
  }

  return avaliacao;
};

module.exports = {
  avaliarMatch,
  buscarMatchPorId,
  listarMatches
};
