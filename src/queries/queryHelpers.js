const isDefined = (value) => (
  value !== undefined &&
  value !== null &&
  !(typeof value === "string" && value.trim() === "")
);

// Os helpers recebem apenas tabelas e colunas controladas pelas queries.
const pickDefined = (source, allowedFields) => {
  return allowedFields.reduce((data, field) => {
    if (isDefined(source[field])) {
      data[field] = source[field];
    }

    return data;
  }, {});
};

const buildInsertQuery = (table, data) => {
  const columns = Object.keys(data);
  const placeholders = columns.map(() => "?").join(", ");

  return {
    sql: `INSERT INTO ${table} (${columns.join(", ")}) VALUES (${placeholders})`,
    values: columns.map((column) => data[column])
  };
};

const buildUpdateQuery = (table, idColumn, id, data) => {
  const columns = Object.keys(data);
  const assignments = columns.map((column) => `${column} = ?`).join(", ");

  return {
    sql: `UPDATE ${table} SET ${assignments} WHERE ${idColumn} = ?`,
    values: [...columns.map((column) => data[column]), id]
  };
};

const buildWhereClause = (filters) => {
  const columns = Object.keys(filters).filter((column) => isDefined(filters[column]));

  if (columns.length === 0) {
    return { clause: "", values: [] };
  }

  return {
    clause: ` WHERE ${columns.map((column) => `${column} = ?`).join(" AND ")}`,
    values: columns.map((column) => filters[column])
  };
};

module.exports = {
  buildInsertQuery,
  buildUpdateQuery,
  buildWhereClause,
  pickDefined
};
