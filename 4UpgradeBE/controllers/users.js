const db = require("../util/dbConnect");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { throwError } = require("../util/errors");

exports.addUser = async (req, res, next) => {
	const username = req.body.username;
	const email = req.body.email;
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
	const username = req.body.username;
	const password = req.body.password;
	const query = "SELECT * FROM users WHERE username = $1";
	const values = [username];
	const result = await db.query(query, values); // Check if suername exist? Check if undefined. Error means server fault
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
		const token = jwt.sign({ username }, process.env.JWT_SECRET, {
			expiresIn: "1h",
		});
		res.status(200).json({ token, username });
	} catch (err) {
		next(err);
	}
};
