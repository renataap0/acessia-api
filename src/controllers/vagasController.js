const vagasService = require("../services/vagasService");
const asyncHandler = require("../middlewares/asyncHandler");

const listarVagas = asyncHandler(async (req, res) => {
  const vagas = await vagasService.listarVagas(req.query);
  res.json({ sucesso: true, dados: vagas });
});

const buscarVagaPorId = asyncHandler(async (req, res) => {
  const vaga = await vagasService.buscarVagaPorId(req.params.id);
  res.json({ sucesso: true, dados: vaga });
});

const criarVaga = asyncHandler(async (req, res) => {
  const id = await vagasService.criarVaga(req.body);
  res.status(201).json({
    sucesso: true,
    mensagem: "Vaga criada com sucesso.",
    dados: { id }
  });
});

const atualizarVaga = asyncHandler(async (req, res) => {
  const vaga = await vagasService.atualizarVaga(req.params.id, req.body);
  res.json({
    sucesso: true,
    mensagem: "Vaga atualizada com sucesso.",
    dados: vaga
  });
});

module.exports = {
  atualizarVaga,
  buscarVagaPorId,
  criarVaga,
  listarVagas
};
