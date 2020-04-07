const db = require("../util/dbConnect");
const { throwError } = require("../util/errors");

exports.getResource = async (req, res, next) => {
	const allResourcesValues = [req.username, req.params.item_uid];
	const allResourcesQuery =
		"SELECT item_uid FROM resource_inventory WHERE username = $1 AND item_uid = $2";
	try {
		const allResources = await db.query(
			allResourcesQuery,
			allResourcesValues
		);
		if (allResources.rows.length > 0) {
			const values = [req.params.item_uid];
			const query = "SELECT * from items where item_uid = $1;";
			result = await db.query(query, values);
			result.rows[0].imgurl = process.env.IP + result.rows[0].imgurl;
			res.status(200).send(result.rows[0]);
		} else {
			throwError(400, "Item doesn't belong to the user.");
		}
	} catch (err) {
		next(err);
	}
};

exports.getResourceInventory = async (req, res, next) => {
	const values = [req.username];
	const query = "SELECT * FROM resource_inventory WHERE username = $1";
	try {
		const result = await db.query(query, values);
		res.status(200).send(result.rows);
	} catch (err) {
		next(err);
	}
};

exports.getWeaponInventory = async (req, res, next) => {
	const values = [req.username];
	const query = "SELECT * FROM weapon_inventory WHERE username = $1";
	try {
		const result = await db.query(query, values);
		res.status(200).send(result.rows);
	} catch (err) {
		next(err);
	}
};
