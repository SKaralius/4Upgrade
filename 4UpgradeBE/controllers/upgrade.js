const db = require("../util/dbConnect");
const { throwError } = require("../util/errors");
const { typeRoll, tierRoll } = require("../util/projectUtil/rolls");
const { v4: uuidv4 } = require("uuid");

exports.postUpgrade = async (req, res, next) => {
	//Verify the user has the item and suficient quantity
	const items = req.body.items;
	try {
		if (items.length > 3) {
			throwError(400, "Please reload the browser");
		}
	} catch (err) {
		next(err);
	}
	const weapon_uid = req.body.id;
	const username = req.username;

	let combinedItemIds = {};
	items.forEach((itemId) => {
		combinedItemIds[itemId] = (combinedItemIds[itemId] || 0) + 1;
	});
	const ids = Object.keys(combinedItemIds);
	const quantities = Object.values(combinedItemIds);
	try {
		confirmItemValidity(username, ids, quantities, next);
		const fullItems = await getFullItems(ids, quantities);
		if (
			(await weaponElixirEffect(fullItems, weapon_uid, username)) === true
		) {
			return res.status(200).send(true);
		} else {
			return res.status(200).send(false);
		}
	} catch (err) {
		next(err);
	}

	// Roll the stat

	// Select the weapon with the username and add the stats, if error
	// weapon doesn't belong to the user and an error will be returned.
};

async function confirmItemValidity(username, ids, quantities, next) {
	for (const [index] of ids.entries()) {
		const itemConfirmationValues = [
			username,
			ids[index],
			quantities[index],
		];
		const itemConfirmationQuery =
			"SELECT username, item_uid, quantity FROM resource_inventory \
            WHERE username = $1 AND item_uid = $2 AND quantity >= $3;";
		const userItems = await db.query(
			itemConfirmationQuery,
			itemConfirmationValues
		);
		try {
			if (userItems.rowCount < 1) {
				return throwError(400, "No such item.");
			}
		} catch (err) {
			next(err);
		}
	}
}

async function getFullItems(ids, quantities) {
	const fullItems = [];
	for (let index = 0; index < ids.length; index++) {
		const {
			rows,
		} = await db.query(
			"SELECT item_uid, name, tier FROM items \
        WHERE item_uid = $1",
			[ids[index]]
		);
		rows[0].quantity = quantities[index];
		fullItems.push(...rows);
	}
	return fullItems;
}

async function weaponElixirEffect(fullItems, weapon_uid, username) {
	if (fullItems[0].item_uid === "a5b5bff3-1ec1-4a94-b998-5394772158ba") {
		const statRetrieveQueryValues = [tierRoll(), typeRoll()];
		const statRetrieveQuery =
			"SELECT * FROM stats WHERE tier = $1 AND type = $2";
		const result = await db.query(
			statRetrieveQuery,
			statRetrieveQueryValues
		);
		const stat_uid = result.rows[0].stat_uid;
		addWeaponStat(stat_uid, username, weapon_uid);
		consumeItems(fullItems, username);
		return true;
	} else {
		return false;
	}
}

async function addWeaponStat(stat_uid, username, weapon_uid) {
	db.query(
		"SELECT weapon_uid FROM weapon_inventory \
    WHERE username = $1 AND weapon_uid = $2",
		[username, weapon_uid]
	);
	const weaponStatInsertQuery =
		"INSERT INTO weapon_stats(weapon_stat_uid, weapon_uid, stat_uid) VALUES($1,$2,$3)";
	const weaponStatInsertQueryValues = [uuidv4(), weapon_uid, stat_uid];
	db.query(weaponStatInsertQuery, weaponStatInsertQueryValues);
}

async function consumeItems(fullItems, username) {
	const updatedItems = [];
	for (let index = 0; index < fullItems.length; index++) {
		const {
			rows,
		} = await db.query(
			"SELECT * FROM resource_inventory \
        WHERE username = $1 AND item_uid = $2",
			[username, fullItems[index].item_uid]
		);
		rows[0].quantity -= fullItems[index].quantity;
		updatedItems.push(rows[0].quantity);
		if (rows[0].quantity < 1) {
			//DELETE ROW BASED ON ENTRY ID
			db.query("DELETE FROM resource_inventory WHERE entry_uid = $1;", [
				rows[0].entry_uid,
			]);
		} else {
			db.query(
				"UPDATE resource_inventory SET quantity = $1 WHERE entry_uid = $2;",
				[rows[0].quantity, rows[0].entry_uid]
			);
		}
	}
	return fullItems;
}
