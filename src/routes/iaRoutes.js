const express = require("express");
const router = express.Router();
const { triagemInteligente } = require("../controllers/iaController");
const { validateRequiredFields } = require("../middlewares/validate");

router.post("/triagem", validateRequiredFields(["texto"]), triagemInteligente);

module.exports = router;
