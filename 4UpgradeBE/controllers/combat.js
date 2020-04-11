const db = require("../util/dbConnect");
const {
	getSession,
	dealDamage,
	deleteSession,
} = require("../util/projectUtil/combatSession");

exports.endEncounter = (req, res, next) => {
	const weapon_uid = req.body.weapon_uid;
	const monster = getSession(req.username, weapon_uid, next);
	if (monster.health <= 0) {
		//Give reward
		deleteSession(req.username);
	} else {
		deleteSession(req.username);
	}
};

exports.getEnemy = (req, res, next) => {
	const weapon_uid = req.params.id;
	const monster = getSession(req.username, weapon_uid, next);
	res.status(200).send(monster);
};

exports.dealDamage = (req, res, next) => {
	const monster = dealDamage(req.username);
	if (monster.health < 0) {
		monster.health = 0;
	}
	res.status(200).send(monster);
};
