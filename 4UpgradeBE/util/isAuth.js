const jwt = require("jsonwebtoken");
const { throwError } = require("./errors");

module.exports = (req, res, next) => {
	// Check if there's an Authorization header
	const authHeader = req.get("Authorization");
	if (!authHeader) {
		throwError(401, "Not Authenticated.");
	}
	const accessToken = authHeader.split(" ")[1];
	let decodedAccessToken;
	//Verify token
	try {
		decodedAccessToken = jwt.verify(
			accessToken,
			process.env.ACCESS_TOKEN_SECRET
		);
	} catch (err) {
		throw err;
	}
	if (!decodedAccessToken) {
		throwError(401, "Not Authenticated.");
	}
	// Write username to req. Now I can be sure that req.username is accurate.
	req.username = decodedAccessToken.username;
	next();
};
