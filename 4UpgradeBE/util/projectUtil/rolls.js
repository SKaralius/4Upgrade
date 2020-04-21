const weighted = require("weighted");

// Sets a weak roll to a higher value.
function badRollShield(roll, shield) {
	if (roll <= shield) roll = shield;
	return roll;
}

function tierRoll(upToTier = 9) {
	let tiers = [];
	for (let i = 1; i <= upToTier; i++) {
		tiers.push(i);
	}
	const options = {
		9: 0.01,
		8: 0.02,
		7: 0.04,
		6: 0.07,
		5: 0.09,
		4: 0.11,
		3: 0.15,
		2: 0.21,
		1: 0.3,
	};
	// Maps to an array of values
	let includedTiers = {};
	tiers.forEach((tier) => {
		const value = options[tier];
		includedTiers = { ...includedTiers, [tier]: value };
	});

	return Number(weighted.select(includedTiers));
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

module.exports = {
	typeRoll,
	tierRoll,
	badRollShield,
};
