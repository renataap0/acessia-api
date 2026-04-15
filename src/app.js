const express = require("express");
const cors = require("cors");

const usuariosRoutes = require("./routes/usuariosRoutes");
const solicitacoesRoutes = require("./routes/solicitacoesRoutes");
const solucoesRoutes = require("./routes/solucoesRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/usuarios", usuariosRoutes);
app.use("/solicitacoes", solicitacoesRoutes);
app.use("/solucoes", solucoesRoutes);

app.get("/", (req, res) => {
  res.json({ mensagem: "API AcessIA funcionando" });
});

module.exports = app;