const express = require("express");
const router = express.Router();
const combatController = require("../controllers/combat");
const isAuth = require("../util/isAuth");

router.get("/getenemy/:id", isAuth, combatController.getEnemy);
router.delete("/endencounter", isAuth, combatController.endEncounter);
router.patch("/dealdamage", isAuth, combatController.dealDamage);

module.exports = router;
