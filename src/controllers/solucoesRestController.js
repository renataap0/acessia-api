const solucoesService = require("../services/solucoesService");
const asyncHandler = require("../middlewares/asyncHandler");

const listarSolucoes = asyncHandler(async (req, res) => {
  const solucoes = await solucoesService.listarSolucoes(req.query);
  res.json({ sucesso: true, dados: solucoes });
});

const buscarSolucaoPorId = asyncHandler(async (req, res) => {
  const solucao = await solucoesService.buscarSolucaoPorId(req.params.id);
  res.json({ sucesso: true, dados: solucao });
});

const criarSolucao = asyncHandler(async (req, res) => {
  const id = await solucoesService.criarSolucao(req.body);
  res.status(201).json({
    sucesso: true,
    mensagem: "Solucao criada com sucesso.",
    dados: { id }
  });
});

const atualizarSolucao = asyncHandler(async (req, res) => {
  const solucao = await solucoesService.atualizarSolucao(req.params.id, req.body);
  res.json({
    sucesso: true,
    mensagem: "Solucao atualizada com sucesso.",
    dados: solucao
  });
});

const atualizarAtivo = asyncHandler(async (req, res) => {
  const solucao = await solucoesService.atualizarAtivo(req.params.id, req.body.ativo);
  res.json({
    sucesso: true,
    mensagem: "Status da solucao atualizado com sucesso.",
    dados: solucao
  });
});

module.exports = {
  atualizarAtivo,
  atualizarSolucao,
  buscarSolucaoPorId,
  criarSolucao,
  listarSolucoes
};
