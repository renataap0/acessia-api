const mysql = require("mysql2/promise");
const { env } = require("./env");

// Pool reutilizavel para todas as queries SQL da aplicacao.
const pool = mysql.createPool({
  host: env.db.host,
  port: env.db.port,
  user: env.db.user,
  password: env.db.password,
  database: env.db.name,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const testarConexao = async () => {
  const connection = await pool.getConnection();
  connection.release();
  return true;
};

pool.testarConexao = testarConexao;

module.exports = pool;
