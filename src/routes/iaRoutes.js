const express = require("express");
const router = express.Router();
const { classificar, triagemInteligente } = require("../controllers/iaController");
const { validateRequiredFields } = require("../middlewares/validate");

router.post("/classificar", validateRequiredFields(["texto"]), classificar);
router.post("/triagem", validateRequiredFields(["texto"]), triagemInteligente);

module.exports = router;
