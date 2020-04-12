const db = require("../util/dbConnect");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { throwError } = require("../util/errors");
const { v4: uuidv4 } = require("uuid");

exports.addUser = async (req, res, next) => {
	const username = req.body.username.toLowerCase();
	const email = req.body.email.toLowerCase();
	const password = req.body.password;
	const hashedPassword = await bcrypt.hash(password, 12);
	console.log(hashedPassword);

	const query =
		"INSERT INTO users(username, email, password) VALUES ($1, $2, $3);";
	const values = [username, email, hashedPassword];

	const lookup =
		"SELECT username, email FROM users WHERE username = $1 OR email = $2;";
	const lookupValues = [username, email];

	const result = await db.query(lookup, lookupValues);

	if (result.rows.length > 0 && result.rows.length < 2) {
		try {
			if (
				result.rows[0].username === username &&
				result.rows[0].email === email
			) {
				throwError(403, "Username and email are already in use.");
			} else if (result.rows[0].username === username) {
				throwError(403, "Username is already in use.");
			} else if (result.rows[0].email === email) {
				throwError(403, "Email is already in use.");
			}
		} catch (err) {
			next(err);
		}
	} else if (result.rows.length > 1) {
		try {
			throwError(403, "Username and email are already in use.");
		} catch (err) {
			next(err);
		}
	} else {
		try {
			await db.query(query, values);
			res.status(200).send({ message: `User ${username} Created` });
		} catch (err) {
			next(err);
		}
	}
};

exports.logIn = async (req, res, next) => {
	// Get user information and validate it against the DB.
	const username = req.body.username.toLowerCase();
	const password = req.body.password;
	const query = "SELECT * FROM users WHERE username = $1";
	const values = [username];
	const result = await db.query(query, values);
	try {
		if (result.rowCount === 0) {
			throwError(401, "Wrong password or username.");
		}
	} catch (err) {
		next(err);
	}
	const isEqual = await bcrypt.compare(password, result.rows[0].password);
	try {
		if (!isEqual) {
			throwError(401, "Wrong password or username.");
		}
		// Sign an return an access token
		const accessToken = generateAccessToken(username);
		const link_uid = uuidv4();
		const refreshToken = generateRefreshToken(link_uid, username);
		res.status(200).json({ accessToken, refreshToken, username });
	} catch (err) {
		next(err);
	}
};

exports.token = async (req, res, next) => {
	const refreshToken = req.body.token;
	if (refreshToken === null) throwError(401, "Not Authorized.");
	// Verify that token is valid.
	//Verify token
	try {
		decodedAccessToken = jwt.verify(
			refreshToken,
			process.env.REFRESH_TOKEN_SECRET
		);
	} catch (err) {
		throw err;
	}
	if (!decodedAccessToken) {
		throwError(401, "Not Authenticated.");
	}
	// Write username to req. Now I can be sure that req.username is accurate.
	const refreshTokenValidationQuery =
		"SELECT * FROM refresh_tokens \
		WHERE link_uid=$1;";
	const refreshTokenValidationValue = [decodedAccessToken.link_uid];
	const refreshTokenValidationResult = await db.query(
		refreshTokenValidationQuery,
		refreshTokenValidationValue
	);
	if (refreshTokenValidationResult.rowCount > 0) {
		const accessToken = generateAccessToken(decodedAccessToken.username);
		res.json({ accessToken });
	} else {
		throwError(400, "Not Authorized.");
	}
};

function generateAccessToken(username) {
	return jwt.sign({ username }, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: "1h",
	});
}
function generateRefreshToken(link_uid, username) {
	const query =
		"INSERT INTO refresh_tokens(link_uid, username)\
	VALUES($1,$2);";
	const values = [link_uid, username];
	db.query(query, values);
	return jwt.sign({ link_uid, username }, process.env.REFRESH_TOKEN_SECRET);
}
