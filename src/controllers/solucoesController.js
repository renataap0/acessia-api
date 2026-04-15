module.exports = require("./solucoesRestController");
/*

const listarSolucoes = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM solucoes");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao listar soluções" });
  }
};

const criarSolucao = async (req, res) => {
  try {
    const {
      titulo,
      descricao_problema,
      solucao_imediata,
      tipo_barreira,
      publico_indicado,
      area_responsavel,
      ativo
    } = req.body;

    const [result] = await db.query(
      `INSERT INTO solucoes
      (titulo, descricao_problema, solucao_imediata, tipo_barreira, publico_indicado, area_responsavel, ativo)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        titulo,
        descricao_problema,
        solucao_imediata,
        tipo_barreira,
        publico_indicado,
        area_responsavel,
        ativo
      ]
    );

    res.status(201).json({
      mensagem: "Solução criada com sucesso",
      id: result.insertId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao criar solução" });
  }
};

module.exports = {
  listarSolucoes,
  criarSolucao
};
*/
