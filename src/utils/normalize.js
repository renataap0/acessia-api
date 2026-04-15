const toTinyInt = (value) => {
  if (value === true || value === "true" || value === "1" || value === "sim") {
    return 1;
  }

  if (value === false || value === "false" || value === "0" || value === "nao") {
    return 0;
  }

  return value;
};

const toJsonString = (value) => {
  if (value === undefined || value === null || value === "") {
    return value;
  }

  if (typeof value === "string") {
    return value;
  }

  return JSON.stringify(value);
};

const normalizeDate = (value) => value || new Date();

module.exports = {
  normalizeDate,
  toJsonString,
  toTinyInt
};
