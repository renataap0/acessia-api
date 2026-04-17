const matchQueries = require("../queries/matchQueries");
const perfisFuncionaisService = require("./perfisFuncionaisService");
const vagasService = require("./vagasService");
const AppError = require("../utils/AppError");
const { TIPOS_BARREIRA, normalizeSearchText } = require("../utils/domain");

const STOPWORDS = new Set([
  "para",
  "com",
  "sem",
  "por",
  "das",
  "dos",
  "uma",
  "que",
  "de",
  "da",
  "do",
  "em",
  "as",
  "os",
  "ao",
  "ou",
  "e"
]);

const barrierKeywords = {
  comunicacao: ["comunicacao", "legenda", "audio", "reuniao", "telefone", "pauta"],
  mobilidade: ["mobilidade", "escada", "rampa", "locomocao", "deslocamento", "rota"],
  sensorial: ["sensorial", "barulho", "luz", "sobrecarga", "ruido", "iluminacao"],
  atitudinal: ["atitudinal", "desrespeito", "preconceito", "capacitismo", "tratamento"],
  digital: ["digital", "sistema", "portal", "acesso", "site", "ferramenta"],
  organizacional: ["organizacional", "instrucoes", "rotina", "organizacao", "ambiguidade", "checklist"]
};

const adaptationByBarrier = {
  comunicacao: "Definir canal preferencial, pauta previa, legenda e resumo por escrito.",
  mobilidade: "Garantir rota acessivel, posto sem barreiras fisicas e plano de deslocamento seguro.",
  sensorial: "Ajustar ruido, luz, pausas e possibilidade de posto com menor estimulo.",
  atitudinal: "Alinhar equipe e lideranca sobre condutas inclusivas e canal seguro de acompanhamento.",
  digital: "Validar ferramentas com teclado, leitor de tela, contraste e canal alternativo temporario.",
  organizacional: "Criar rotina clara, checklist, prioridades explicitas e combinados de acompanhamento."
};

const parseJsonSafely = (value) => {
  if (!value || typeof value !== "string") {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch (error) {
    return value;
  }
};

const toPlainText = (value) => {
  const parsed = parseJsonSafely(value);

  if (Array.isArray(parsed)) {
    return parsed.map(toPlainText).join(" ");
  }

  if (parsed && typeof parsed === "object") {
    return Object.values(parsed).map(toPlainText).join(" ");
  }

  return String(parsed || "");
};

const unique = (items) => [...new Set(items.filter(Boolean))];

const tokenize = (text) => {
  return unique(
    normalizeSearchText(text)
      .split(/[^a-z0-9]+/)
      .filter((token) => token.length > 3 && !STOPWORDS.has(token))
  );
};

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const detectBarriers = (text) => {
  const normalized = normalizeSearchText(text);

  return TIPOS_BARREIRA.filter((barrier) => {
    return barrierKeywords[barrier].some((word) => normalized.includes(word));
  });
};

const intersection = (left, right) => {
  const rightSet = new Set(right);
  return left.filter((item) => rightSet.has(item));
};

const textFromFields = (entity, fields) => {
  return fields.map((field) => toPlainText(entity[field])).join(" ");
};

const adaptationPotentialScore = (vaga) => {
  const text = normalizeSearchText(vaga.possibilidade_de_adaptacao);
  let score = 0;

  if (text.includes("alta")) score += 20;
  if (text.includes("media")) score += 12;
  if (text.includes("baixa")) score += 4;
  if (/(permite|flexivel|ajuste|adaptacao|remoto|alternativo)/.test(text)) score += 6;

  return clamp(score, 0, 24);
};

const riskMessages = (barriers, vaga) => {
  if (!barriers.length) {
    return [];
  }

  return barriers.map((barrier) => (
    `${barrier}: barreira prevista em ${vaga.titulo || "cargo"} deve ser acompanhada com adaptacoes.`
  ));
};

const recommendedAdaptations = (barriers, perfil) => {
  const needs = toPlainText(perfil.necessidades_de_adaptacao);
  const recommendations = barriers.map((barrier) => adaptationByBarrier[barrier]);

  if (needs) {
    recommendations.unshift(`Considerar necessidades informadas: ${needs}.`);
  }

  return unique(recommendations);
};

const avaliarVaga = (perfil, vaga) => {
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
    "barreiras_que_impactam_o_desempenho"
  ]);
  const vagaBarreirasTexto = textFromFields(vaga, [
    "ambiente_de_trabalho",
    "barreiras_potenciais",
    "rotina_da_funcao",
    "ferramentas_utilizadas"
  ]);

  const competenciasEmComum = intersection(tokenize(perfilCompetencias), tokenize(vagaRequisitos));
  const barreirasPerfil = detectBarriers(perfilBarreirasTexto);
  const barreirasVaga = detectBarriers(vagaBarreirasTexto);
  const barreirasDeRisco = intersection(barreirasPerfil, barreirasVaga);
  const adaptacaoScore = adaptationPotentialScore(vaga);
  const competenciaScore = Math.min(35, competenciasEmComum.length * 6);
  const barreiraPenalty = barreirasDeRisco.length * 12 + (adaptacaoScore < 10 ? barreirasVaga.length * 3 : 0);
  const compatibilidade = clamp(50 + competenciaScore + adaptacaoScore - barreiraPenalty, 0, 100);
  const barreirasParaAdaptar = unique([...barreirasDeRisco, ...barreirasPerfil]);

  return {
    idvagas: vaga.idvagas || null,
    titulo: vaga.titulo,
    area: vaga.area,
    compatibilidade,
    competencias_em_comum: competenciasEmComum,
    barreiras_previstas: barreirasVaga,
    barreiras_de_risco: barreirasDeRisco,
    incidencia_de_barreiras: barreirasDeRisco.length,
    adaptacoes_recomendadas: recommendedAdaptations(barreirasParaAdaptar, perfil),
    riscos_de_incompatibilidade: riskMessages(barreirasDeRisco, vaga),
    justificativa: `Compatibilidade calculada por habilidades em comum (${competenciasEmComum.length}), barreiras previstas (${barreirasDeRisco.length}) e adaptabilidade da vaga.`
  };
};

const buildAreasMaisCompativeis = (avaliacoes) => {
  const grouped = avaliacoes.reduce((acc, avaliacao) => {
    const current = acc[avaliacao.area] || {
      area: avaliacao.area,
      total: 0,
      soma: 0,
      melhor_cargo: avaliacao.titulo,
      melhor_compatibilidade: avaliacao.compatibilidade
    };

    current.total += 1;
    current.soma += avaliacao.compatibilidade;

    if (avaliacao.compatibilidade > current.melhor_compatibilidade) {
      current.melhor_cargo = avaliacao.titulo;
      current.melhor_compatibilidade = avaliacao.compatibilidade;
    }

    acc[avaliacao.area] = current;
    return acc;
  }, {});

  return Object.values(grouped)
    .map((item) => ({
      area: item.area,
      compatibilidade_media: Number((item.soma / item.total).toFixed(2)),
      melhor_cargo: item.melhor_cargo,
      melhor_compatibilidade: item.melhor_compatibilidade
    }))
    .sort((a, b) => b.compatibilidade_media - a.compatibilidade_media)
    .slice(0, 3);
};

const buildPlanoAcolhimento = (adaptacoes) => [
  "Validar com a pessoa as preferencias, necessidades e limites antes da alocacao.",
  "Definir gestor responsavel, canal de acompanhamento e primeira revisao em ate 15 dias.",
  "Aplicar adaptacoes iniciais sem reduzir autonomia ou escopo profissional.",
  adaptacoes[0] || "Registrar combinados de trabalho e revisar barreiras percebidas no primeiro ciclo."
];

const resolvePerfil = async (payload) => {
  const perfilId = payload.perfil_funcional_id || payload.perfis_funcionais_idperfis_funcionais;

  if (perfilId) {
    const perfil = await perfisFuncionaisService.buscarPerfilFuncionalPorId(perfilId);
    return { perfil, perfilId };
  }

  if (payload.perfil_funcional || payload.perfil) {
    return { perfil: payload.perfil_funcional || payload.perfil, perfilId: null };
  }

  throw new AppError("Informe perfil_funcional_id ou perfil_funcional.", 400);
};

const resolveVagas = async (payload) => {
  if (Array.isArray(payload.vaga_ids) || payload.vaga_id) {
    const ids = Array.isArray(payload.vaga_ids) ? payload.vaga_ids : [payload.vaga_id];
    return vagasService.buscarVagasPorIds(ids.map(Number));
  }

  if (Array.isArray(payload.vagas)) {
    return payload.vagas;
  }

  if (payload.vaga) {
    return [payload.vaga];
  }

  const vagasAtivas = await vagasService.listarVagas({ ativo: 1 });

  if (!vagasAtivas.length) {
    throw new AppError("Nenhuma vaga ativa encontrada para avaliacao.", 404);
  }

  return vagasAtivas;
};

const avaliarMatch = async (payload) => {
  const { perfil, perfilId } = await resolvePerfil(payload);
  const vagas = await resolveVagas(payload);

  if (!vagas.length) {
    throw new AppError("Informe ao menos uma vaga para avaliar.", 400);
  }

  const ranking = vagas
    .map((vaga) => avaliarVaga(perfil, vaga))
    .sort((a, b) => b.compatibilidade - a.compatibilidade);
  const cargosComMenorIncidencia = [...ranking]
    .sort((a, b) => a.incidencia_de_barreiras - b.incidencia_de_barreiras || b.compatibilidade - a.compatibilidade)
    .slice(0, 3)
    .map((item) => ({
      idvagas: item.idvagas,
      titulo: item.titulo,
      area: item.area,
      compatibilidade: item.compatibilidade,
      incidencia_de_barreiras: item.incidencia_de_barreiras
    }));
  const adaptacoes = unique(ranking.flatMap((item) => item.adaptacoes_recomendadas));
  const riscos = unique(ranking.flatMap((item) => item.riscos_de_incompatibilidade));

  const resultado = {
    areas_com_maior_compatibilidade: buildAreasMaisCompativeis(ranking),
    cargos_com_menor_incidencia_de_barreiras: cargosComMenorIncidencia,
    adaptacoes_recomendadas: adaptacoes,
    riscos_de_incompatibilidade: riscos,
    justificativa: "Match orientativo calculado por sobreposicao de habilidades, barreiras previstas e possibilidade de adaptacao. O resultado nao deve excluir automaticamente a pessoa de vagas.",
    plano_inicial_de_acolhimento: buildPlanoAcolhimento(adaptacoes),
    ranking_compatibilidade: ranking
  };

  const id = await matchQueries.criar({
    perfis_funcionais_idperfis_funcionais: perfilId,
    entrada_json: payload,
    resultado_json: resultado
  });

  return {
    id,
    ...resultado
  };
};

const buscarMatchPorId = async (id) => {
  const avaliacao = await matchQueries.buscarPorId(id);

  if (!avaliacao) {
    throw new AppError("Avaliacao de match nao encontrada.", 404);
  }

  return {
    ...avaliacao,
    entrada_json: parseJsonSafely(avaliacao.entrada_json),
    resultado_json: parseJsonSafely(avaliacao.resultado_json)
  };
};

module.exports = {
  avaliarMatch,
  buscarMatchPorId
};
