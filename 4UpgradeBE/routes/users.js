const express = require("express");
const router = express.Router();
const userController = require("../controllers/users");
const { check } = require("express-validator");

router.post(
	"/addUser",
	[
		check("username")
			.isLength({ min: 2, max: 36 })
			.isAlphanumeric()
			.trim()
			.escape(),
		check("password").isLength({ min: 6, max: 255 }),
	],
	userController.addUser
);
router.post("/demoUser", userController.addDemoUser);
router.post("/logIn", userController.logIn);
router.post("/token", userController.token);
router.delete("/logout", userController.logOut);

module.exports = router;
