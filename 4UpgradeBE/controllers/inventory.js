const db = require("../util/dbConnect");
const { throwError } = require("../util/errors");
const { itemTierRoll } = require("../util/projectUtil/rolls");
const { v4: uuidv4 } = require("uuid");

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

exports.addItemToUser = async (req, res, next) => {
	const username = req.username;
	if (!(await isFreeInventorySpace(username))) {
		return res.status(200).send(false);
	}
	const itemTier = itemTierRoll();
	const itemToAddResult = await db.query(
		"SELECT item_uid FROM items \
			WHERE tier = $1;",
		[itemTier]
	);
	// TODO: 0 should be replaced with some kind of RNG, to return different
	// same tier items.
	const itemIdToAdd = itemToAddResult.rows[0].item_uid;
	const result = await db.query(
		"SELECT * FROM resource_inventory \
				WHERE username = $1 AND item_uid = $2",
		[username, itemIdToAdd]
	);
	if (result.rowCount === 0) {
		db.query(
			"INSERT INTO resource_inventory(entry_uid, username, item_uid, quantity)\
		VALUES($1, $2, '$3', $4);",
			[uuidv4(), username, itemIdToAdd, 1]
		);
	} else {
		db.query(
			"UPDATE resource_inventory SET quantity = $1\
		WHERE entry_uid = $2",
			[result.rows[0].quantity + 1, result.rows[0].entry_uid]
		);
	}
	return res.status(200).send(result.rows[0].item_uid);
};

async function isFreeInventorySpace(username) {
	let totalQuantity = 0;
	const {
		rows,
	} = await db.query(
		"SELECT quantity FROM resource_inventory \
	WHERE username = $1",
		[username]
	);
	rows.forEach((row) => (totalQuantity += row.quantity));
	if (totalQuantity < 24) {
		return true;
	} else {
		return false;
	}
}
