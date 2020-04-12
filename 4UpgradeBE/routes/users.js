const express = require("express");
const router = express.Router();
const userController = require("../controllers/users");

router.post("/addUser", userController.addUser);
router.post("/logIn", userController.logIn);
router.post("/token", userController.token);

module.exports = router;
