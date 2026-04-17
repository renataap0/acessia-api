const express = require("express");
const router = express.Router();
const { avaliar, buscarPorId } = require("../controllers/matchController");
const { validateIdParam } = require("../middlewares/validate");

router.post("/avaliar", avaliar);
router.get("/:id", validateIdParam(), buscarPorId);

module.exports = router;
