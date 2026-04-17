const express = require("express");
const router = express.Router();

const arquivosRoutes = require("./arquivosRoutes");
const dashboardRoutes = require("./dashboardRoutes");
const encaminhamentosRoutes = require("./encaminhamentosRoutes");
const feedbacksRoutes = require("./feedbacksRoutes");
const iaRoutes = require("./iaRoutes");
const logsIaRoutes = require("./logsIaRoutes");
const matchRoutes = require("./matchRoutes");
const perfisFuncionaisRoutes = require("./perfisFuncionaisRoutes");
const relatoriosRoutes = require("./relatoriosRoutes");
const solicitacoesRoutes = require("./solicitacoesRoutes");
const solucaoRelacionadaRoutes = require("./solucaoRelacionadaRoutes");
const solucoesRoutes = require("./solucoesRoutes");
const solucoesSolicitacoesRoutes = require("./solucoesSolicitacoesRoutes");
const usuariosRoutes = require("./usuariosRoutes");
const vagasRoutes = require("./vagasRoutes");

router.get("/", (req, res) => {
  res.json({
    nome: "AcessIA API",
    versao: "1.0.0",
    modulos: [
      "/api/usuarios",
      "/api/solicitacoes",
      "/api/solucoes",
      "/api/encaminhamentos",
      "/api/feedbacks",
      "/api/arquivos",
      "/api/logs-ia",
      "/api/dashboard/resumo",
      "/api/dashboard/barreiras",
      "/api/dashboard/tempo-medio",
      "/api/perfis-funcionais",
      "/api/vagas",
      "/api/match",
      "/api/match/avaliar",
      "/api/solucoes-solicitacoes",
      "/api/solucao-relacionada",
      "/api/relatorios/indicadores",
      "/api/ia/classificar",
      "/api/ia/triagem"
    ]
  });
});

router.use("/usuarios", usuariosRoutes);
router.use("/solicitacoes", solicitacoesRoutes);
router.use("/solucoes", solucoesRoutes);
router.use("/encaminhamentos", encaminhamentosRoutes);
router.use("/feedbacks", feedbacksRoutes);
router.use("/arquivos", arquivosRoutes);
router.use("/logs-ia", logsIaRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/perfis-funcionais", perfisFuncionaisRoutes);
router.use("/vagas", vagasRoutes);
router.use("/match", matchRoutes);
router.use("/solucoes-solicitacoes", solucoesSolicitacoesRoutes);
router.use("/solucao-relacionada", solucaoRelacionadaRoutes);
router.use("/relatorios", relatoriosRoutes);
router.use("/ia", iaRoutes);

module.exports = router;
