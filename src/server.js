const app = require("./app");
const { env } = require("./config/env");

const PORT = env.port;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
