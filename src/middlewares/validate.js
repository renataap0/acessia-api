const AppError = require("../utils/AppError");

const isEmpty = (value) => (
  value === undefined ||
  value === null ||
  (typeof value === "string" && value.trim() === "")
);

const validateRequiredFields = (fields) => (req, res, next) => {
  const missing = fields.filter((field) => isEmpty(req.body[field]));

  if (missing.length > 0) {
    throw new AppError("Campos obrigatorios ausentes.", 400, { campos: missing });
  }

  next();
};

const validateAtLeastOneField = (fields) => (req, res, next) => {
  const hasAnyField = fields.some((field) => !isEmpty(req.body[field]));

  if (!hasAnyField) {
    throw new AppError("Informe ao menos um campo para atualizar.", 400, { campos: fields });
  }

  next();
};

const validateIdParam = (paramName = "id") => (req, res, next) => {
  const value = Number(req.params[paramName]);

  if (!Number.isInteger(value) || value <= 0) {
    throw new AppError("Parametro de identificacao invalido.", 400, { parametro: paramName });
  }

  next();
};

module.exports = {
  validateAtLeastOneField,
  validateIdParam,
  validateRequiredFields
};
