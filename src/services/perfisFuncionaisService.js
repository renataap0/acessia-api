const perfisFuncionaisQueries = require("../queries/perfisFuncionaisQueries");
const AppError = require("../utils/AppError");
const { toTextValue, toTinyInt } = require("../utils/normalize");

const TEXT_FIELDS = [
  "habilidades_profissionais",
  "experiencias_anteriores",
  "facilidades_no_ambiente",
  "dificuldades_encontradas",
  "preferencias_de_comunicacao",
  "necessidades_de_adaptacao",
  "barreiras_que_impactam_o_desempenho",
  "tipo_de_apoio_necessario"
];

const normalizePayload = (payload, isCreate = false) => {
  const normalized = {
    ...payload,
    ativo: payload.ativo === undefined ? (isCreate ? 1 : undefined) : toTinyInt(payload.ativo)
  };

  TEXT_FIELDS.forEach((field) => {
    normalized[field] = toTextValue(payload[field]);
  });

  return normalized;
};

const listarPerfisFuncionais = (filters) => {
  return perfisFuncionaisQueries.listar({
    ...filters,
    ativo: filters.ativo === undefined ? undefined : toTinyInt(filters.ativo)
  });
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
