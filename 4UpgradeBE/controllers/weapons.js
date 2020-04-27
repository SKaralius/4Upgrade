const db = require("../util/dbConnect");
const { v4: uuidv4 } = require("uuid");
const weighted = require("weighted");
const {
	getWeaponStats,
	getWeaponInfo,
	removeStat,
	deleteWeaponFromUser,
} = require("../util/projectUtil/helperFunctions");
const { deleteSession } = require("../util/projectUtil/combatSession");

exports.getWeapon = async (req, res, next) => {
	const username = req.username;
	const weapon_entry_uid = req.params.id;
	try {
		const weaponInfo = await getWeaponInfo(username, weapon_entry_uid);
		res.status(200).send(weaponInfo);
	} catch (err) {
		next(err);
	}
};

exports.getWeaponStats = async (req, res, next) => {
	const username = req.username;
	deleteSession(username);
	const weapon_entry_uid = req.params.id;
	const weaponStats = await getWeaponStats(username, weapon_entry_uid, next);
	res.status(200).send({
		stats: weaponStats.stats,
		totalDamage: weaponStats.totalDamage,
		weaponInfo: weaponStats.weaponInfo,
	});
};

exports.removeWeaponStat = async (req, res, next) => {
	const statRetrieveQueryValues = [req.body.id];
	const statRetrieveQuery =
		"SELECT * FROM weapon_stats WHERE weapon_entry_uid = $1;";
	const result = await db.query(statRetrieveQuery, statRetrieveQueryValues);
	const statRemoveResult = await removeStat(result.rows);
	res.status(200).send(statRemoveResult);
};

exports.deleteWeaponFromUser = async (req, res, next) => {
	const weapon_entry_uid = req.body.weapon_entry_uid;
	const username = req.username;
	deleteWeaponFromUser(username, weapon_entry_uid);
	res.status(200).send("deleted");
};

function tierRoll() {
	const options = {
		"1": 0.01,
		"2": 0.02,
		"3": 0.04,
		"4": 0.07,
		"5": 0.09,
		"6": 0.11,
		"7": 0.15,
		"8": 0.21,
		"9": 0.3,
	};
	return weighted.select(options);
}

function typeRoll() {
	const options = {
		Earth: 0.25,
		Fire: 0.25,
		Wind: 0.25,
		Lightning: 0.25,
	};
	return weighted.select(options);
}
