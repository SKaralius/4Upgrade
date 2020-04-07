const express = require("express");
const router = express.Router();
const upgradeController = require("../controllers/upgrade");
const isAuth = require("../util/isAuth");

router.post("/postUpgrade", isAuth, upgradeController.postUpgrade);

module.exports = router;
