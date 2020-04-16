const db = require("../dbConnect");
const { throwError } = require("../errors");
const { v4: uuidv4 } = require("uuid");
const { tierRoll, itemTierRoll } = require("./rolls");

async function setUpUser(username) {
	giveWeapon(username, 2);
	// TODO: Limit mat tiers
	for (let i = 0; i < 5; i++) {
		giveItem(username, 2);
	}
}

async function giveWeapon(username, upToTier) {
	const weaponTier = [tierRoll(upToTier)];
	const weaponToInsertQuery = "SELECT * FROM weapons WHERE tier = $1;";
	const weaponToInsert = await db.query(weaponToInsertQuery, weaponTier);
	const sameTierItemSelect = Math.floor(
		Math.random() * weaponToInsert.rowCount
	);
	const giveWeaponValues = [
		uuidv4(),
		username,
		weaponToInsert.rows[sameTierItemSelect].weapon_uid,
	];
	const giveWeaponQuery =
		"INSERT INTO weapon_inventory(weapon_entry_uid, username, weapon_uid)\
	 VALUES($1, $2, $3)";
	db.query(giveWeaponQuery, giveWeaponValues);
}

async function giveItem(username, upToTier) {
	if (!(await isFreeInventorySpace(username))) {
		return;
	}
	const itemTier = itemTierRoll(upToTier);
	const itemToAddResult = await db.query(
		"SELECT item_uid FROM items \
			WHERE tier = $1;",
		[itemTier]
	);
	const sameTierItemSelect = Math.floor(
		Math.random() * itemToAddResult.rowCount
	);
	console.log(
		{ sameTierItemSelect },
		{ itemresult: itemToAddResult.rowCount }
	);
	const itemIdToAdd = itemToAddResult.rows[sameTierItemSelect].item_uid;
	const result = await db.query(
		"SELECT * FROM resource_inventory \
				WHERE username = $1 AND item_uid = $2",
		[username, itemIdToAdd]
	);
	if (result.rowCount === 0) {
		db.query(
			"INSERT INTO resource_inventory(entry_uid, username, item_uid, quantity)\
		VALUES($1, $2, $3, $4);",
			[uuidv4(), username, itemIdToAdd, 1]
		);
	} else {
		db.query(
			"UPDATE resource_inventory SET quantity = $1\
		WHERE entry_uid = $2",
			[result.rows[0].quantity + 1, result.rows[0].entry_uid]
		);
	}
	return itemIdToAdd;
}

async function deleteItem(username, item_uid) {
	const {
		rows,
	} = await db.query(
		"SELECT * FROM resource_inventory \
        WHERE username = $1 AND item_uid = $2",
		[username, item_uid]
	);
	rows[0].quantity -= 1;
	if (rows[0].quantity < 1) {
		//DELETE ROW BASED ON ENTRY ID
		return await db.query(
			"DELETE FROM resource_inventory WHERE entry_uid = $1;",
			[rows[0].entry_uid]
		);
		// else I update the row in db.
	} else {
		return await db.query(
			"UPDATE resource_inventory SET quantity = $1 WHERE entry_uid = $2;",
			[rows[0].quantity, rows[0].entry_uid]
		);
	}
}

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
// Returns the weapon stats result from the DB with tiers converted to damage values.
// Checks if user owns the weapon.
async function getWeaponStats(username, weapon_entry_uid, next) {
	const weaponQuery =
		"SELECT * FROM weapon_inventory WHERE weapon_entry_uid = $1";
	const statQuery =
		"SELECT weapon_stats.weapon_stat_uid, weapon_stats.weapon_entry_uid, weapon_stats.stat_uid, \
		stats.tier, stats.type FROM \
		weapon_stats INNER JOIN stats ON weapon_stats.stat_uid = stats.stat_uid \
		WHERE weapon_stats.weapon_entry_uid = $1;";

	try {
		const { rows } = await db.query(weaponQuery, [weapon_entry_uid]);
		if (rows.length > 0) {
			if (rows[0].username !== username) {
				throwError(401, "Not Authorized");
			}
			const weaponInfo = await getWeaponInfo(
				username,
				rows[0].weapon_entry_uid
			);
			const statsResult = await db.query(statQuery, [weapon_entry_uid]);
			const stats = statsResult.rows;
			const totalDamage = {
				minTotalDamage: weaponInfo.damage.minDamage,
				maxTotalDamage: weaponInfo.damage.maxDamage,
			};
			stats.forEach((stat) => {
				stat.damage = tierToDamage(stat.tier);
				totalDamage.minTotalDamage += stat.damage.minDamage;
				totalDamage.maxTotalDamage += stat.damage.maxDamage;
			});

			return { stats, totalDamage, weaponInfo };
			//return result ehre
		} else {
			throwError(400, "No record found.");
		}
	} catch (err) {
		next(err);
	}
}

async function getWeaponInfo(username, weapon_entry_uid) {
	const authorizationValues = [weapon_entry_uid, username];
	const authorizationQuery =
		"SELECT * FROM weapon_inventory WHERE weapon_entry_uid = $1 AND username = $2";
	const authorizationQueryResult = await db.query(
		authorizationQuery,
		authorizationValues
	);
	if (authorizationQueryResult.rows.length < 1) {
		throwError(401, "Not Authorized");
	}
	const values = [authorizationQueryResult.rows[0].weapon_uid];
	const query = "SELECT * FROM weapons WHERE weapon_uid = $1";
	const result = await db.query(query, values);
	result.rows[0].imgurl = process.env.IP + result.rows[0].imgurl;
	result.rows[0].damage = tierToDamage(result.rows[0].tier);
	return result.rows[0];
}

async function item_uidToResource(item_uid) {
	const values = [item_uid];
	const query = "SELECT * from items where item_uid = $1;";
	return await db.query(query, values);
}
// Doesn't check if the user is authorized.
async function removeStat(weapon_stat_uid) {
	const statToDelete = [weapon_stat_uid];

	const statDeleteQuery =
		"DELETE FROM weapon_stats WHERE weapon_stat_uid = $1;";
	return await db.query(statDeleteQuery, statToDelete);
}

function tierToDamage(tier) {
	let minDamage = 0;
	let maxDamage = 0;
	switch (tier) {
		case 1:
			minDamage = 5;
			maxDamage = 9;
			return { minDamage, maxDamage };
		case 2:
			minDamage = 8;
			maxDamage = 14;
			return { minDamage, maxDamage };
		case 3:
			minDamage = 12;
			maxDamage = 21;
			return { minDamage, maxDamage };
		case 4:
			minDamage = 18;
			maxDamage = 32;
			return { minDamage, maxDamage };
		case 5:
			minDamage = 27;
			maxDamage = 47;
			return { minDamage, maxDamage };
		case 6:
			minDamage = 41;
			maxDamage = 71;
			return { minDamage, maxDamage };
		case 7:
			minDamage = 62;
			maxDamage = 106;
			return { minDamage, maxDamage };
		case 8:
			minDamage = 82;
			maxDamage = 159;
			return { minDamage, maxDamage };
		case 9:
			minDamage = 103;
			maxDamage = 212;
			return { minDamage, maxDamage };
		default:
			return { minDamage, maxDamage };
	}
}

module.exports = {
	setUpUser,
	giveWeapon,
	giveItem,
	deleteItem,
	isFreeInventorySpace,
	item_uidToResource,
	getWeaponStats,
	getWeaponInfo,
	removeStat,
};
