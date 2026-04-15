const db = require("../config/db");

const listarSolicitacoes = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM solicitacoes");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao listar solicitações" });
  }
};

const buscarSolicitacaoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(
      "SELECT * FROM solicitacoes WHERE idsolicitacoes = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ erro: "Solicitação não encontrada" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao buscar solicitação" });
  }
};

const criarSolicitacao = async (req, res) => {
  try {
    const {
      canal,
      tipo_barreira,
      urgencia,
      area_responsavel,
      precisa_profissional,
      confianca_ia,
      classificacao_ia_json,
      atualizado_em,
      criado_em,
      usuarios_idusuarios
    } = req.body;

    const [result] = await db.query(
      `INSERT INTO solicitacoes
      (canal, tipo_barreira, urgencia, area_responsavel, precisa_profissional, confianca_ia, classificacao_ia_json, atualizado_em, criado_em, usuarios_idusuarios)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        canal,
        tipo_barreira,
        urgencia,
        area_responsavel,
        precisa_profissional,
        confianca_ia,
        classificacao_ia_json,
        atualizado_em,
        criado_em,
        usuarios_idusuarios
      ]
    );

    res.status(201).json({
      mensagem: "Solicitação criada com sucesso",
      id: result.insertId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao criar solicitação" });
  }
};

module.exports = {
  listarSolicitacoes,
  buscarSolicitacaoPorId,
  criarSolicitacao
};