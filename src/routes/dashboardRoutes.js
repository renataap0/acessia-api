const express = require("express");
const router = express.Router();
const {
  barreiras,
  indicadores,
  resumo,
  tempoMedio
} = require("../controllers/dashboardController");

router.get("/", indicadores);
router.get("/indicadores", indicadores);
router.get("/resumo", resumo);
router.get("/barreiras", barreiras);
router.get("/tempo-medio", tempoMedio);

module.exports = router;
