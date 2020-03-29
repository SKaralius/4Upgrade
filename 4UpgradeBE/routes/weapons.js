const express = require("express");
const router = express.Router();
const weaponController = require("../controllers/weapons");

router.post("/sendWeapon", weaponController.sendWeapon);

router.get("/getWeapons", weaponController.getWeapons);

module.exports = router;
