const normalizeText = (text) => {
  return String(text || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
};

// Regras simples para simular uma futura triagem por IA real.
const ruleSets = [
  {
    tipo_barreira: "comunicacao",
    area_responsavel: "Comunicacao interna",
    precisa_profissional: false,
    palavras: ["legenda", "audio", "reuniao", "reunioes", "libras", "telefone"]
  },
  {
    tipo_barreira: "mobilidade",
    area_responsavel: "Facilities",
    precisa_profissional: true,
    palavras: ["escada", "rampa", "locomocao", "cadeira de rodas", "elevador", "acesso"]
  },
  {
    tipo_barreira: "sensorial",
    area_responsavel: "RH e saude ocupacional",
    precisa_profissional: true,
    palavras: ["barulho", "luz", "sobrecarga", "sensorial", "ruido", "cheiro"]
  },
  {
    tipo_barreira: "cognitiva_organizacional",
    area_responsavel: "Gestao e RH",
    precisa_profissional: false,
    palavras: ["instrucoes", "texto longo", "organizacao", "rotina", "prazo", "tarefas"]
  },
  {
    tipo_barreira: "atitudinal",
    area_responsavel: "RH",
    precisa_profissional: false,
    palavras: ["preconceito", "piada", "constrangimento", "exclusao", "tratamento"]
  },
  {
    tipo_barreira: "acesso_digital",
    area_responsavel: "Tecnologia da informacao",
    precisa_profissional: false,
    palavras: ["sistema", "site", "aplicativo", "leitor de tela", "contraste", "digital"]
  }
];

const urgencyWords = {
  alta: ["urgente", "risco", "dor", "acidente", "nao consigo", "impossivel"],
  media: ["dificuldade", "atrapalha", "limitacao", "frequente", "problema"]
};

const countMatches = (text, words) => {
  return words.filter((word) => text.includes(word)).length;
};

const inferUrgency = (text) => {
  if (countMatches(text, urgencyWords.alta) > 0) {
    return "alta";
  }

  if (countMatches(text, urgencyWords.media) > 0) {
    return "media";
  }

  return "baixa";
};

const classificarTriagem = (texto) => {
  const normalizedText = normalizeText(texto);
  const matches = ruleSets
    .map((rule) => ({
      ...rule,
      pontuacao: countMatches(normalizedText, rule.palavras)
    }))
    .sort((a, b) => b.pontuacao - a.pontuacao);

  const bestMatch = matches[0].pontuacao > 0
    ? matches[0]
    : {
      tipo_barreira: "nao_classificada",
      area_responsavel: "RH",
      precisa_profissional: false,
      pontuacao: 0,
      palavras: []
    };

  const confianca = Math.min(0.95, Number((0.55 + bestMatch.pontuacao * 0.12).toFixed(2)));
  const urgencia = inferUrgency(normalizedText);

  const classificacao = {
    origem: "simulador_regras_v1",
    texto_analisado: texto,
    regras_consideradas: matches.map((match) => ({
      tipo_barreira: match.tipo_barreira,
      pontuacao: match.pontuacao
    })),
    gerado_em: new Date().toISOString()
  };

  return {
    tipo_barreira: bestMatch.tipo_barreira,
    urgencia,
    area_responsavel: bestMatch.area_responsavel,
    precisa_profissional: bestMatch.precisa_profissional,
    confianca_ia: confianca,
    classificacao_ia_json: classificacao
  };
};

module.exports = {
  classificarTriagem
};
