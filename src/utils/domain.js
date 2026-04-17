const TIPOS_BARREIRA = [
  "comunicacao",
  "mobilidade",
  "sensorial",
  "atitudinal",
  "digital",
  "organizacional"
];

const CANAIS_ENTRADA = ["app", "web", "totem"];

const URGENCIAS = ["baixa", "media", "alta", "critica"];

const STATUS_SOLICITACAO = [
  "aberta",
  "em_triagem",
  "em_andamento",
  "encaminhada",
  "resolvida",
  "concluida",
  "cancelada"
];

const SLA_HORAS_POR_URGENCIA = {
  critica: 4,
  alta: 8,
  media: 24,
  baixa: 72
};

const normalizeSearchText = (value) => {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
};

module.exports = {
  CANAIS_ENTRADA,
  SLA_HORAS_POR_URGENCIA,
  STATUS_SOLICITACAO,
  TIPOS_BARREIRA,
  URGENCIAS,
  normalizeSearchText
};
