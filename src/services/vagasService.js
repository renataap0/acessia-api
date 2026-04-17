const vagasQueries = require("../queries/vagasQueries");
const AppError = require("../utils/AppError");
const { toTextValue, toTinyInt } = require("../utils/normalize");

const TEXT_FIELDS = [
  "exigencias_do_cargo",
  "rotina_da_funcao",
  "ambiente_de_trabalho",
  "ferramentas_utilizadas",
  "barreiras_potenciais",
  "possibilidade_de_adaptacao"
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

const listarVagas = (filters) => {
  return vagasQueries.listar({
    ...filters,
    ativo: filters.ativo === undefined ? undefined : toTinyInt(filters.ativo)
  });
};

const buscarVagaPorId = async (id) => {
  const vaga = await vagasQueries.buscarPorId(id);

  if (!vaga) {
    throw new AppError("Vaga nao encontrada.", 404);
  }

  return vaga;
};

const buscarVagasPorIds = async (ids) => {
  const vagas = await vagasQueries.buscarPorIds(ids);

  if (vagas.length !== ids.length) {
    throw new AppError("Uma ou mais vagas nao foram encontradas.", 404);
  }

  return vagas;
};

const criarVaga = (payload) => {
  return vagasQueries.criar(normalizePayload(payload, true));
};

const atualizarVaga = async (id, payload) => {
  const affectedRows = await vagasQueries.atualizar(id, normalizePayload(payload));

  if (affectedRows === 0) {
    throw new AppError("Vaga nao encontrada.", 404);
  }

  return buscarVagaPorId(id);
};

module.exports = {
  atualizarVaga,
  buscarVagaPorId,
  buscarVagasPorIds,
  criarVaga,
  listarVagas
};
