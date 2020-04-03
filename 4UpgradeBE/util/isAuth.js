const jwt = require("jsonwebtoken");
const { throwError } = require("./errors");

module.exports = (req, res, next) => {
	const authHeader = req.get("Authorization");
	if (!authHeader) {
		throwError(401, "Not Authenticated.");
	}
	const token = authHeader.split(" ")[1];
	let decodedToken;
	try {
		decodedToken = jwt.verify(token, process.env.JWT_SECRET);
	} catch (err) {
		throw err;
	}
	if (!decodedToken) {
		throwError(401, "Not Authenticated.");
	}
	req.username = decodedToken.username;
	next();
};
