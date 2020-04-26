const {
	getSession,
	dealDamage,
	deleteSession,
} = require("../util/projectUtil/combatSession");

const { giveReward } = require("../util/projectUtil/helperFunctions");

exports.endEncounter = (req, res, next) => {
	const weapon_uid = req.body.weapon_uid;
	const monster = getSession(req.username, weapon_uid, next);
	if (monster && monster.health <= 0) {
		giveReward(username, upToTier);
		deleteSession(req.username);
	}
	res.status(200).send({ message: "Monster is dead." });
};

exports.getEnemy = (req, res, next) => {
	const weapon_uid = req.params.id;
	const monster = getSession(req.username, weapon_uid, next);
	res.status(200).send(monster);
};

exports.dealDamage = async (req, res, next) => {
	const username = req.username;
	const monster = dealDamage(username);
	if (monster.currentHealth < 1) {
		const upToTier = upToTierItems(monster.maxHealth);
		monster.currentHealth = 0;
		const result = await giveReward(username, upToTier);
		if (result.item_uid) {
			monster.item_uid = result.item_uid;
		} else if (result.weapon_entry_uid) {
			monster.weapon_entry_uid = result.weapon_entry_uid;
		} else if (result.error) {
			monster.error = result.error;
		}
		deleteSession(username);
	}
	res.status(200).send(monster);
};

function upToTierItems(maxHealth) {
	switch (true) {
		case maxHealth > 50 && maxHealth < 100:
			return 3;
		case maxHealth > 100 && maxHealth < 200:
			return 4;
		case maxHealth > 200 && maxHealth < 250:
			return 5;
		case maxHealth > 250 && maxHealth < 350:
			return 6;
		case maxHealth > 350 && maxHealth < 560:
			return 7;
		case maxHealth > 560 && maxHealth < 1100:
			return 8;
		case maxHealth > 1100:
			return 9;
		default:
			return 1;
	}
}
