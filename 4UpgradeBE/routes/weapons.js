const express = require("express");
const router = express.Router();
const weaponController = require("../controllers/weapons");

router.get("/getWeapon/:id", weaponController.getWeapon);

router.get("/getweaponstats/:id", weaponController.getWeaponStats);

router.post("/addweaponstat/:id", weaponController.addWeaponStat);

module.exports = router;
