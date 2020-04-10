const express = require("express");
const router = express.Router();
const inventoryController = require("../controllers/inventory");
const isAuth = require("../util/isAuth");

router.get(
	"/getresourceinventory",
	isAuth,
	inventoryController.getResourceInventory
);
router.get("/getresource/:item_uid", isAuth, inventoryController.getResource);

router.get(
	"/getweaponinventory",
	isAuth,
	inventoryController.getWeaponInventory
);

router.post("/addItemToUser", isAuth, inventoryController.addItemToUser);

router.delete(
	"/deleteitemfromuser",
	isAuth,
	inventoryController.deleteItemFromUser
);

module.exports = router;
