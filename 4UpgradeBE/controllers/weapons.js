const db = require("../util/dbConnect");
const { v4: uuidv4 } = require("uuid");
const weighted = require("weighted");

exports.getWeapon = async (req, res, next) => {
	const id = req.params.id;
	const query = "SELECT * FROM weapons WHERE weapon_uid = $1";
	db.query(query, [id], (err, result) => {
		if (err) {
			return next(err);
		}
		res.status(200).send(result.rows);
	});
};

exports.getWeaponStats = async (req, res, next) => {
	const id = req.params.id;
	const query =
		"select weapon_stats.weapon_stat_uid, weapon_stats.weapon_uid, weapon_stats.stat_uid, stats.tier, stats.type from weapon_stats inner join stats on weapon_stats.stat_uid = stats.stat_uid WHERE weapon_stats.weapon_uid = $1;";
	db.query(query, [id], (err, result) => {
		if (err) {
			return next(err);
		}
		res.status(200).send(result.rows);
	});
};

exports.addWeaponStat = async (req, res, next) => {
	const weapon_stat_uid = uuidv4();
	const weapon_id = req.params.id;
	const statRetrieveQuery =
		"SELECT * FROM stats WHERE tier = $1 AND type = $2";
	const statRetrieveQueryValues = [tierRoll(), typeRoll()];

	const stat_uid = db.query(
		statRetrieveQuery,
		statRetrieveQueryValues,
		(err, result) => {
			if (err) {
				return next(err);
			}
			console.log(result.rows[0].stat_uid);
			return result.rows[0].stat_uid;
		}
	); //has to be a query into stats table, the stat_uid has to be retrieved from type and tier;
	const weaponStatInsertQuery =
		"INSERT INTO weapon_stats(weapon_stat_uid, weapon_uid, stat_uid) VALUES($1,$2,$3)";
	const weaponStatInsertQueryValues = [weapon_stat_uid, weapon_id, stat_uid];
	console.log(stat_uid);
	db.query(
		weaponStatInsertQuery,
		weaponStatInsertQueryValues,
		(err, result) => {
			if (err) {
				return next(err);
			}
			res.status(200).send("Stat added");
		}
	);
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
		"9": 0.3
	};
	return weighted.select(options);
}

function typeRoll() {
	const options = {
		Earth: 0.25,
		Fire: 0.25,
		Wind: 0.25,
		Lightning: 0.25
	};
	return weighted.select(options);
}
