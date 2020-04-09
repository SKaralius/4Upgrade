const weighted = require("weighted");

function tierRoll() {
	const options = {
		"9": 0.01,
		"8": 0.02,
		"7": 0.04,
		"6": 0.07,
		"5": 0.09,
		"4": 0.11,
		"3": 0.15,
		"2": 0.21,
		"1": 0.3,
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
// TODO: When there are more items in the DB, the roll
// doesn't have to be limited to 2 tiers, and rollTier can be used.
function itemTierRoll() {
	const options = {
		"1": 0.5,
		"3": 0.5,
	};
	return weighted.select(options);
}

module.exports = {
	typeRoll,
	tierRoll,
	itemTierRoll,
};
