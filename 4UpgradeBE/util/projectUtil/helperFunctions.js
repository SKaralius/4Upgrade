const db = require("../dbConnect");
const { throwError } = require("../errors");

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

async function getWeaponStats(username, weapon_uid, next) {
	const weaponQuery = "SELECT * FROM weapon_inventory WHERE weapon_uid = $1";
	const statQuery =
		"SELECT weapon_stats.weapon_stat_uid, weapon_stats.weapon_uid, weapon_stats.stat_uid, \
		stats.tier, stats.type FROM \
		weapon_stats INNER JOIN stats ON weapon_stats.stat_uid = stats.stat_uid \
		WHERE weapon_stats.weapon_uid = $1;";

	try {
		const { rows } = await db.query(weaponQuery, [weapon_uid]);
		if (rows.length > 0) {
			if (rows[0].username !== username) {
				throwError(401, "Not Authorized");
			}
			const stats = await db.query(statQuery, [weapon_uid]);
			stats.rows.map((row) => (row.damage = tierToDamage(row.tier)));
			return stats;
			//return result ehre
		} else {
			throwError(400, "No record found.");
		}
	} catch (err) {
		next(err);
	}
}

function removeStat(stats) {
	const randomNumber = Math.ceil(Math.random() * stats.length);
	const statToDelete = [stats[randomNumber - 1].weapon_stat_uid];

	const statDeleteQuery =
		"DELETE FROM weapon_stats WHERE weapon_stat_uid = $1;";
	db.query(statDeleteQuery, statToDelete);
	return {
		length: stats.length,
		randomNumber,
		statToDelete,
	};
}

function tierToDamage(tier) {
	let minDamage = 0;
	let maxDamage = 0;
	switch (tier) {
		case 1:
			minDamage = 5;
			maxDamage = 9;
			return [minDamage, maxDamage];
		case 2:
			minDamage = 8;
			maxDamage = 14;
			return [minDamage, maxDamage];
		case 3:
			minDamage = 12;
			maxDamage = 21;
			return [minDamage, maxDamage];
		case 4:
			minDamage = 18;
			maxDamage = 32;
			return [minDamage, maxDamage];
		case 5:
			minDamage = 27;
			maxDamage = 47;
			return [minDamage, maxDamage];
		case 6:
			minDamage = 41;
			maxDamage = 71;
			return [minDamage, maxDamage];
		case 7:
			minDamage = 62;
			maxDamage = 106;
			return [minDamage, maxDamage];
		case 8:
			minDamage = 82;
			maxDamage = 159;
			return [minDamage, maxDamage];
		case 9:
			minDamage = 103;
			maxDamage = 212;
			return [minDamage, maxDamage];
		default:
			return [minDamage, maxDamage];
	}
}

module.exports = { isFreeInventorySpace, getWeaponStats, removeStat };
