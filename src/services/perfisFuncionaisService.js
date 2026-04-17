const perfisFuncionaisQueries = require("../queries/perfisFuncionaisQueries");
const AppError = require("../utils/AppError");
const { normalizeDate, toTextValue } = require("../utils/normalize");

const TEXT_FIELDS = [
  "habilidades_profissionais",
  "experiencias_anteriores",
  "facilidades_no_ambiente",
  "dificuldades_encontradas",
  "preferencias_de_comunicacao",
  "necessidades_de_adaptacao",
  "barreiras_impactantes",
  "tipo_de_apoio_necessario"
];

const normalizePayload = (payload, isCreate = false) => {
  const normalized = {
    ...payload,
    barreiras_impactantes: payload.barreiras_impactantes ||
      payload.barreiras_que_impactam_o_desempenho,
    created_at: payload.created_at || (isCreate ? normalizeDate(payload.criado_em) : undefined),
    updated_at: normalizeDate(payload.updated_at || payload.atualizado_em)
  };

  TEXT_FIELDS.forEach((field) => {
    normalized[field] = toTextValue(normalized[field]);
  });

  return normalized;
};

const listarPerfisFuncionais = (filters) => {
  return perfisFuncionaisQueries.listar(filters);
};

const buscarPerfilFuncionalPorId = async (id) => {
  const perfil = await perfisFuncionaisQueries.buscarPorId(id);

  if (!perfil) {
    throw new AppError("Perfil funcional nao encontrado.", 404);
  }

  return perfil;
};

const criarPerfilFuncional = (payload) => {
  return perfisFuncionaisQueries.criar(normalizePayload(payload, true));
};

const atualizarPerfilFuncional = async (id, payload) => {
  const affectedRows = await perfisFuncionaisQueries.atualizar(id, normalizePayload(payload));

  if (affectedRows === 0) {
    throw new AppError("Perfil funcional nao encontrado.", 404);
  }

  return buscarPerfilFuncionalPorId(id);
};

module.exports = {
  atualizarPerfilFuncional,
  buscarPerfilFuncionalPorId,
  criarPerfilFuncional,
  listarPerfisFuncionais
};
