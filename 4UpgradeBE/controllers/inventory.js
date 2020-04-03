const db = require("../util/dbConnect");
const { throwError } = require("../util/errors");

exports.getResourceInventory = async (req, res, next) => {
	const username = req.params.username;
	const query = "SELECT * FROM resource_inventory WHERE username = $1";
	const values = [username];
	try {
		if (username !== req.username) {
			throwError(401, "Not Authorized");
		}
		const result = await db.query(query, values);
		res.status(200).send({ resources: result.rows });
	} catch (err) {
		next(err);
	}
};

exports.getWeaponInventory = async (req, res, next) => {
	const username = req.params.username;
	const query = "SELECT * FROM weapon_inventory WHERE username = $1";
	const values = [username];
	try {
		if (username !== req.username) {
			throwError(401, "Not Authorized");
		}
		const result = await db.query(query, values);
		res.status(200).send({ resources: result.rows });
	} catch (err) {
		next(err);
	}
};
