const { normalizeSearchText } = require("../utils/domain");

// Regras simples para simular uma futura triagem por IA real.
const ruleSets = [
  {
    tipo_barreira: "comunicacao",
    area_responsavel: "Comunicacao interna",
    precisa_profissional: false,
    acao_imediata_sugerida: "Garantir comunicacao em formato acessivel, como legenda, texto ou resumo por escrito.",
    palavras: ["legenda", "audio", "reuniao", "telefone"]
  },
  {
    tipo_barreira: "mobilidade",
    area_responsavel: "Facilities",
    precisa_profissional: true,
    acao_imediata_sugerida: "Liberar rota acessivel temporaria e remover bloqueios de circulacao.",
    palavras: ["escada", "rampa", "locomocao", "deslocamento"]
  },
  {
    tipo_barreira: "sensorial",
    area_responsavel: "RH e saude ocupacional",
    precisa_profissional: true,
    acao_imediata_sugerida: "Reduzir estimulos do ambiente e oferecer alternativa de posto, pausa ou equipamento de apoio.",
    palavras: ["barulho", "luz", "sobrecarga", "ruido"]
  },
  {
    tipo_barreira: "digital",
    area_responsavel: "Tecnologia da informacao",
    precisa_profissional: false,
    acao_imediata_sugerida: "Disponibilizar canal alternativo acessivel enquanto o sistema e avaliado por tecnologia.",
    palavras: ["sistema", "portal", "acesso", "site"]
  },
  {
    tipo_barreira: "organizacional",
    area_responsavel: "Gestao e RH",
    precisa_profissional: false,
    acao_imediata_sugerida: "Registrar instrucoes por escrito, definir prioridade e alinhar responsaveis.",
    palavras: ["instrucoes", "rotina", "organizacao", "ambiguidade"]
  },
  {
    tipo_barreira: "atitudinal",
    area_responsavel: "RH",
    precisa_profissional: true,
    acao_imediata_sugerida: "Acolher o relato, proteger a pessoa afetada e acionar RH para apuracao humanizada.",
    palavras: ["desrespeito", "preconceito", "capacitismo", "tratamento"]
  }
];

const priorityWords = {
  critica: ["risco", "acidente", "assedio", "humilhacao", "imediato", "critico"],
  alta: ["urgente", "dor", "nao consigo", "impossivel", "impede", "bloqueia"],
  media: ["dificuldade", "atrapalha", "frequente", "sobrecarga", "prejudica"]
};

const countMatches = (text, words) => words.filter((word) => text.includes(word)).length;

const inferPriority = (text, metadata = {}) => {
  const urgenciaInformada = normalizeSearchText(metadata.urgencia || metadata.prioridade);

  if (["critica", "alta", "media", "baixa"].includes(urgenciaInformada)) {
    return urgenciaInformada;
  }

  if (countMatches(text, priorityWords.critica) > 0) {
    return "critica";
  }

  if (countMatches(text, priorityWords.alta) > 0) {
    return "alta";
  }

  if (countMatches(text, priorityWords.media) > 0) {
    return "media";
  }

  return "baixa";
};

const classificarTexto = (texto, metadados = {}) => {
  const normalizedText = normalizeSearchText(`${texto || ""} ${JSON.stringify(metadados || {})}`);
  const matches = ruleSets
    .map((rule) => ({
      ...rule,
      pontuacao: countMatches(normalizedText, rule.palavras)
    }))
    .sort((a, b) => b.pontuacao - a.pontuacao);

  const bestMatch = matches[0].pontuacao > 0
    ? matches[0]
    : {
      tipo_barreira: "organizacional",
      area_responsavel: "Gestao e RH",
      precisa_profissional: false,
      acao_imediata_sugerida: "Encaminhar para triagem humana e coletar mais contexto antes da decisao.",
      pontuacao: 0,
      palavras: []
    };

  const prioridade = inferPriority(normalizedText, metadados);
  const confianca = Math.min(0.95, Number((0.50 + bestMatch.pontuacao * 0.15).toFixed(2)));

  const classificacaoIaJson = {
    origem: "simulador_regras_v1",
    texto_analisado: texto,
    metadados_considerados: metadados || {},
    regras_consideradas: matches.map((match) => ({
      tipo_barreira: match.tipo_barreira,
      pontuacao: match.pontuacao
    })),
    observacao: "Triagem orientativa. A decisao final deve ser humana.",
    gerado_em: new Date().toISOString()
  };

  return {
    tipo_barreira: bestMatch.tipo_barreira,
    prioridade,
    area_responsavel: bestMatch.area_responsavel,
    precisa_profissional: bestMatch.precisa_profissional,
    confianca_ia: confianca,
    acao_imediata: bestMatch.acao_imediata_sugerida,
    acao_imediata_sugerida: bestMatch.acao_imediata_sugerida,
    classificacao_ia_json: classificacaoIaJson
  };
};

const classificarTriagem = (texto, metadados = {}) => {
  const classificacao = classificarTexto(texto, metadados);

  return {
    ...classificacao,
    urgencia: classificacao.prioridade
  };
};

module.exports = {
  classificarTexto,
  classificarTriagem
};
