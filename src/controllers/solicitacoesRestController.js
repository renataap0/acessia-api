const solicitacoesService = require("../services/solicitacoesService");
const asyncHandler = require("../middlewares/asyncHandler");

const listarSolicitacoes = asyncHandler(async (req, res) => {
  const solicitacoes = await solicitacoesService.listarSolicitacoes(req.query);
  res.json({ sucesso: true, dados: solicitacoes });
});

const buscarSolicitacaoPorId = asyncHandler(async (req, res) => {
  const solicitacao = await solicitacoesService.buscarSolicitacaoPorId(req.params.id);
  res.json({ sucesso: true, dados: solicitacao });
});

const criarSolicitacao = asyncHandler(async (req, res) => {
  const id = await solicitacoesService.criarSolicitacao(req.body);
  res.status(201).json({
    sucesso: true,
    mensagem: "Solicitacao criada com sucesso.",
    dados: { id }
  });
});

const atualizarStatus = asyncHandler(async (req, res) => {
  const solicitacao = await solicitacoesService.atualizarStatus(req.params.id, req.body.status);
  res.json({
    sucesso: true,
    mensagem: "Status atualizado com sucesso.",
    dados: solicitacao
  });
});

const classificarUrgencia = asyncHandler(async (req, res) => {
  const solicitacao = await solicitacoesService.classificarUrgencia(req.params.id, req.body.urgencia);
  res.json({
    sucesso: true,
    mensagem: "Urgencia atualizada com sucesso.",
    dados: solicitacao
  });
});

const associarUsuario = asyncHandler(async (req, res) => {
  const solicitacao = await solicitacoesService.associarUsuario(
    req.params.id,
    req.body.usuarios_idusuarios
  );

  res.json({
    sucesso: true,
    mensagem: "Solicitacao associada ao usuario com sucesso.",
    dados: solicitacao
  });
});

module.exports = {
  associarUsuario,
  atualizarStatus,
  buscarSolicitacaoPorId,
  classificarUrgencia,
  criarSolicitacao,
  listarSolicitacoes
};
