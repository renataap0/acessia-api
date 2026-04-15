const db = require("../config/db");

const listarUsuarios = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM usuarios");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao listar usuários" });
  }
};

const buscarUsuarioPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query("SELECT * FROM usuarios WHERE idusuarios = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao buscar usuário" });
  }
};

const criarUsuario = async (req, res) => {
  try {
    const { nome, email, tipo_usuario, unidade, cargo, created_at } = req.body;

    const [result] = await db.query(
      `INSERT INTO usuarios (nome, email, tipo_usuario, unidade, cargo, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nome, email, tipo_usuario, unidade, cargo, created_at]
    );

    res.status(201).json({
      mensagem: "Usuário criado com sucesso",
      id: result.insertId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao criar usuário" });
  }
};

module.exports = {
  listarUsuarios,
  buscarUsuarioPorId,
  criarUsuario
};