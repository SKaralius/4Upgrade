const db = require("../util/dbConnect");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { throwError } = require("../util/errors");
const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");
const { setUpUser } = require("../util/projectUtil/helperFunctions");

exports.addUser = async (req, res, next) => {
	const username = req.body.username.toLowerCase();
	const email = req.body.email.toLowerCase();
	const password = req.body.password;
	const hashedPassword = await bcrypt.hash(password, 12);

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}
	// Check if username or email already exists
	const lookup =
		"SELECT username, email FROM users WHERE username = $1 OR email = $2;";
	const lookupValues = [username, email];
	const lookupResult = await db.query(lookup, lookupValues);
	// Returns a single row if email OR username exists, returns 2 rows if both used
	// by different users
	if (lookupResult.rows.length > 0 && lookupResult.rows.length < 2) {
		try {
			if (
				lookupResult.rows[0].username === username &&
				lookupResult.rows[0].email === email
			) {
				throwError(403, "Username and email are already in use.");
			} else if (lookupResult.rows[0].username === username) {
				throwError(403, "Username is already in use.");
			} else if (lookupResult.rows[0].email === email) {
				throwError(403, "Email is already in use.");
			}
		} catch (err) {
			next(err);
		}
	} else if (lookupResult.rows.length > 1) {
		try {
			throwError(403, "Username and email are already in use.");
		} catch (err) {
			next(err);
		}
		// If lookup doesn't return any values, that means email and username are unique.
	} else {
		try {
			const createUserQuery =
				"INSERT INTO users(username, email, password) VALUES ($1, $2, $3);";
			const createUserValues = [username, email, hashedPassword];
			await db.query(createUserQuery, createUserValues);
			// Setup new character
			setUpUser(username);
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

exports.logOut = async (req, res, next) => {
	const refreshToken = req.body.refreshToken;
	jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, function (
		err,
		decodedRefreshToken
	) {
		if (!decodedRefreshToken) {
			throwError(401, "Not Authenticated.");
		}
		link_uid = decodedRefreshToken.link_uid;
		db.query("DELETE FROM refresh_tokens WHERE link_uid=$1", [link_uid]);
		res.status(200).send({ message: "Logged out" });
	});
};

exports.token = async (req, res, next) => {
	const refreshToken = req.body.token;
	if (refreshToken === null) throwError(401, "Not Authorized.");
	// Verify that token is valid.
	//Verify token
	try {
		decodedRefreshToken = jwt.verify(
			refreshToken,
			process.env.REFRESH_TOKEN_SECRET
		);
	} catch (err) {
		throw err;
	}
	if (!decodedRefreshToken) {
		throwError(401, "Not Authenticated.");
	}
	// Write username to req. Now I can be sure that req.username is accurate.
	const refreshTokenValidationQuery =
		"SELECT * FROM refresh_tokens \
		WHERE link_uid=$1;";
	const refreshTokenValidationValue = [decodedRefreshToken.link_uid];
	const refreshTokenValidationResult = await db.query(
		refreshTokenValidationQuery,
		refreshTokenValidationValue
	);
	if (refreshTokenValidationResult.rowCount > 0) {
		const accessToken = generateAccessToken(decodedRefreshToken.username);
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
