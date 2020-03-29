const express = require("express");
const router = express.Router();
const informationController = require("../controllers/information");

router.get("/", informationController.getInformation);

router.post("/post", informationController.sendInformation);

router.post("/sendWeapon", informationController.sendWeapon);

router.get("/getWeapons", informationController.getWeapons);

module.exports = router;
