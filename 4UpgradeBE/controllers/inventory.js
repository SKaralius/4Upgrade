const db = require("../util/dbConnect");
const {
	deleteItem,
	item_uidToResource,
} = require("../util/projectUtil/helperFunctions");

exports.getResource = async (req, res, next) => {
	try {
		let itemResponse = await item_uidToResource(req.params.item_uid);
		itemResponse.rows[0].imgurl =
			process.env.IP + itemResponse.rows[0].imgurl;
		res.status(200).send(itemResponse.rows[0]);
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

exports.deleteItemFromUser = async (req, res, next) => {
	deleteItem(req.username, req.body.item_uid);
	res.status(200).send("Item deleted.");
};
