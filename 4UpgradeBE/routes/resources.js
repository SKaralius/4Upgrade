const express = require("express");
const router = express.Router();
const resourceController = require("../controllers/resources");

router.get("/getresources", resourceController.getResources);

module.exports = router;
