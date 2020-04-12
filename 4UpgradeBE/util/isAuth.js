const jwt = require("jsonwebtoken");
const { throwError } = require("./errors");

module.exports = (req, res, next) => {
	// Check if there's an Authorization header
	const authHeader = req.get("Authorization");
	//Verify token
	try {
		if (!authHeader) {
			throwError(401, "Not Authenticated.");
		}
		const accessToken = authHeader.split(" ")[1];
		jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, function (
			err,
			decodedAccessToken
		) {
			if (err) throwError(200, "Token Expired");
			if (!decodedAccessToken) {
				throwError(401, "Not Authenticated.");
			}
			req.username = decodedAccessToken.username;
			next();
		});
	} catch (err) {
		return next(err);
	}
	// Write username to req. Now I can be sure that req.username is accurate.
};
