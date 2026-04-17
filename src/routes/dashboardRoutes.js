const express = require("express");
const router = express.Router();
const { indicadores } = require("../controllers/dashboardController");

router.get("/", indicadores);
router.get("/indicadores", indicadores);

module.exports = router;
