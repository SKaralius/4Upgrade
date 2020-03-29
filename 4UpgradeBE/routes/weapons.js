const express = require("express");
const router = express.Router();
const informationController = require("../controllers/weapons");

router.post("/sendWeapon", informationController.sendWeapon);

router.get("/getWeapons", informationController.getWeapons);

module.exports = router;
