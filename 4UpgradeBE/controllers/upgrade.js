const db = require("../util/dbConnect");
const { throwError } = require("../util/errors");
const {
	typeRoll,
	tierRoll,
	badRollShield,
} = require("../util/projectUtil/rolls");
const { v4: uuidv4 } = require("uuid");
const {
	deleteItem,
	getWeaponStats,
	item_uidToResource,
	removeStat,
} = require("../util/projectUtil/helperFunctions");

exports.postUpgrade = async (req, res, next) => {
	//Verify the user has the item and suficient quantity
	const item_uids = req.body.items;
	const weapon_entry_uid = req.body.id;
	const username = req.username;
	try {
		if (item_uids.length > 2 || item_uids.length < 1) {
			throwError(400, "Please reload the browser");
		}
	} catch (err) {
		next(err);
	}
	// Retrieves weapon stats, also check's if weapon_entry_uid belongs to user.
	const currentWeaponStats = await getWeaponStats(
		username,
		weapon_entry_uid,
		next
	);

	const fullItemsPromises = await item_uids.map(async (item_uid) => {
		const response = await item_uidToResource(item_uid);
		return response.rows[0];
	});
	const fullItems = await Promise.all(fullItemsPromises);

	const effectSortResultArray = effectSort(
		fullItems,
		weapon_entry_uid,
		currentWeaponStats.stats,
		username
	);
	if (!effectSortResultArray.effectPossible) {
		return res
			.status(200)
			.send({ success: false, message: effectSortResultArray.message });
	}
	try {
		for (let i = 0; i < item_uids.length; i++) {
			// Confirm item validity throws an error, if user does not have items that were sent in the request.
			await confirmItemValidity(username, item_uids[i]);
			await deleteItem(username, item_uids[i]);
		}
		await effectSortResultArray.executeEffect();
		return res.status(200).send({
			success: true,
			message: effectSortResultArray.message,
		});
	} catch (err) {
		next(err);
	}
};

// Roll the stat

// Select the weapon with the username and add the stats, if error
// weapon doesn't belong to the user and an error will be returned.

async function confirmItemValidity(username, item_uid) {
	const itemConfirmationValues = [username, item_uid];
	const itemConfirmationQuery =
		"SELECT username, item_uid, quantity FROM resource_inventory \
		WHERE username = $1 AND item_uid = $2;";
	const userItemResult = await db.query(
		itemConfirmationQuery,
		itemConfirmationValues
	);
	// TEST if returns error with faux request
	if (userItemResult.rowCount < 1) {
		return throwError(400, "Please refresh the page.");
	} else {
		return userItemResult;
	}
}

async function addWeaponStat(stat_uid, username, weapon_entry_uid) {
	db.query(
		"SELECT weapon_entry_uid FROM weapon_inventory \
    WHERE username = $1 AND weapon_entry_uid = $2",
		[username, weapon_entry_uid]
	);
	const weaponStatInsertQuery =
		"INSERT INTO weapon_stats(weapon_stat_uid, weapon_entry_uid, stat_uid) VALUES($1,$2,$3)";
	const weaponStatInsertQueryValues = [uuidv4(), weapon_entry_uid, stat_uid];
	return await db.query(weaponStatInsertQuery, weaponStatInsertQueryValues);
}

// Selects a stat at weighted random from the DB. Calls another func to add the
// stat to the weapon.
async function addStatEffect(weapon_entry_uid, fullItems, username) {
	// Rolling up to first items tier
	let rolledValue = tierRoll(fullItems[0].tier);
	// If there's a second item, value can't be lower than it's tier.
	if (fullItems[1]) {
		if (fullItems[1].tier <= fullItems[0].tier)
			rolledValue = badRollShield(rolledValue, fullItems[1].tier);
		else {
			rolledValue = fullItems[0].tier;
		}
	}
	const statRetrieveQueryValues = [
		rolledValue,
		fullItems[0].type ? fullItems[0].type : typeRoll(),
	];
	const statRetrieveQuery =
		"SELECT * FROM stats WHERE tier = $1 AND type = $2";
	const result = await db.query(statRetrieveQuery, statRetrieveQueryValues);
	const stat_uid = result.rows[0].stat_uid;
	await addWeaponStat(stat_uid, username, weapon_entry_uid);
}
// Picks a weapon stat at complete random and removes it.
async function removeStatEffect(currentWeaponStats, fullItems) {
	let randomNumber = 0;
	if (fullItems[1]) {
		const filteredStats = currentWeaponStats.filter(
			(stat) => stat.tier < fullItems[1].tier
		);
		if (filteredStats.length === 0) {
			randomNumber = Math.ceil(Math.random() * currentWeaponStats.length);
			return removeStat(
				currentWeaponStats[randomNumber - 1].weapon_stat_uid
			);
		}
		randomNumber = Math.ceil(Math.random() * filteredStats.length);
		return await removeStat(
			filteredStats[randomNumber - 1].weapon_stat_uid
		);
	}
	randomNumber = Math.ceil(Math.random() * currentWeaponStats.length);
	return await removeStat(
		currentWeaponStats[randomNumber - 1].weapon_stat_uid
	);
}
// Checks if the first item sent is defined in combinations and returns
// an object which contains values if effect is possible,
// a message and the effect's function.
function effectSort(fullItems, weapon_entry_uid, currentWeaponStats, username) {
	switch (fullItems[0].effect) {
		case "add":
			if (currentWeaponStats.length > 5) {
				return {
					effectPossible: false,
					message: "Weapon stats are full.",
				};
			}
			return {
				effectPossible: true,
				message: fullItems[1]
					? "The second item improved your chances."
					: "Weapon upgraded.",
				executeEffect: () =>
					addStatEffect(weapon_entry_uid, fullItems, username),
			};
		case "remove":
			if (currentWeaponStats.length === 0) {
				return {
					effectPossible: false,
					message: "No stats to delete.",
				};
			}
			return {
				effectPossible: true,
				message: fullItems[1]
					? "The second item improved your chances."
					: "Weapon upgraded.",
				executeEffect: () =>
					removeStatEffect(currentWeaponStats, fullItems),
			};
		default:
			return {
				effectPossible: false,
				message: "No such combination.",
			};
	}
}
