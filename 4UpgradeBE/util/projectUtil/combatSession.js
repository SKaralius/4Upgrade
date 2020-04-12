const { getWeaponStats } = require("./helperFunctions");
// TODO: MEMORY LEAK!!! Is storing sessions in an object appropriate?
// is it possible to delete a session when JWT expires?
// I can call server from FE to delete the session on logout, but what
// if user just navigates away?
let session = {};

async function getSession(username, weapon_uid, next) {
	const weaponStats = await getWeaponStats(username, weapon_uid, next);
	if (session[username]) {
		return session[username];
	} else {
		session[username] = {
			maxHealth:
				weaponStats.totalDamage.maxTotalDamage *
				weaponStats.stats.length,
			currentHealth:
				weaponStats.totalDamage.maxTotalDamage *
				weaponStats.stats.length,
			weaponStats,
		};
		return session[username];
	}
}

function dealDamage(username) {
	const variance =
		session[username].weaponStats.totalDamage.maxTotalDamage -
		session[username].weaponStats.totalDamage.minTotalDamage;
	const roll = Math.ceil(variance * Math.random());
	if (session[username].cooldown) {
		const timeRemaining = session[username].cooldown - Date.now();
		if (timeRemaining <= 0) {
			session[username].currentHealth -=
				session[username].weaponStats.totalDamage.minTotalDamage + roll;
			if (session[username].currentHealth <= 0) {
				return session[username];
			}
			session[username].cooldown = Date.now() + 700;
			return session[username];
		} else {
			return { message: "Too fast" };
		}
	} else {
		session[username].currentHealth -=
			session[username].weaponStats.totalDamage.minTotalDamage + roll;
		session[username].cooldown = Date.now() + 700;
		return session[username];
	}
}

function deleteSession(username) {
	delete session[username];
}

module.exports = { getSession, dealDamage, deleteSession };
