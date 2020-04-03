const express = require("express");
const router = express.Router();
const inventoryController = require("../controllers/inventory");
const isAuth = require("../util/isAuth");

router.get(
	"/getresourceinventory/:username",
	isAuth,
	inventoryController.getResourceInventory
);

router.get(
	"/getweaponinventory/:username",
	isAuth,
	inventoryController.getWeaponInventory
);

module.exports = router;
