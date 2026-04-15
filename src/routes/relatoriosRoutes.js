const express = require("express");
const router = express.Router();
const { indicadoresGerais } = require("../controllers/relatoriosController");

router.get("/indicadores", indicadoresGerais);

module.exports = router;
