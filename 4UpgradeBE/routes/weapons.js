const express = require("express");
const router = express.Router();
const weaponController = require("../controllers/weapons");
const isAuth = require("../util/isAuth");

router.get("/getWeapon/:id", isAuth, weaponController.getWeapon);

router.get("/getweaponstats/:id", isAuth, weaponController.getWeaponStats);

router.post("/addweaponstat", isAuth, weaponController.addWeaponStat);

router.delete("/removeweaponstat", isAuth, weaponController.removeWeaponStat);

module.exports = router;
