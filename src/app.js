const express = require("express");
const cors = require("cors");

const routes = require("./routes");
const { env } = require("./config/env");
const notFound = require("./middlewares/notFound");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

// Middlewares globais da API.
app.use(cors({ origin: env.corsOrigin }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    nome: "AcessIA API",
    status: "online",
    documentacao: "/api"
  });
});

app.use("/api", routes);

// Tratamento padronizado para rotas inexistentes e erros.
app.use(notFound);
app.use(errorHandler);

module.exports = app;
