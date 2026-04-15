const AppError = require("../utils/AppError");
const { env } = require("../config/env");

const mysqlMessages = {
  ER_DUP_ENTRY: "Registro duplicado.",
  ER_NO_REFERENCED_ROW_2: "Registro relacionado nao encontrado.",
  ER_ROW_IS_REFERENCED_2: "Registro possui dependencias e nao pode ser removido."
};

const errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  // Erros conhecidos recebem mensagem limpa; erros inesperados ficam genericos.
  const isAppError = error instanceof AppError || error.isOperational;
  const statusCode = isAppError ? error.statusCode : 500;
  const message = isAppError
    ? error.message
    : mysqlMessages[error.code] || "Erro interno no servidor.";

  if (!isAppError || env.nodeEnv !== "production") {
    console.error(error);
  }

  return res.status(statusCode).json({
    sucesso: false,
    erro: {
      mensagem: message,
      codigo: error.code || null,
      detalhes: error.details || null
    }
  });
};

module.exports = errorHandler;
