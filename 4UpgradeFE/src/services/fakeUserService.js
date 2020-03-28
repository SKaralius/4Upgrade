const resources = [
	{ id: 1, qty: 5 },
	{ id: 2, qty: 3 },
	{ id: 3, qty: 9 },
	{ id: 4, qty: 1 }
];

const weapons = [
	{
		id: 5,
		name: "Glaive",
		url: "./img/placeholder.png",
		stats: [1, 2, 3]
	}
];

const stats = [
	{
		id: 1,
		power: Math.ceil(Math.random() * 10),
		desc: `Adds ${Math.ceil(Math.random() * 10)} fire damage`,
		textColor: "red"
	},
	{
		id: 2,
		power: Math.ceil(Math.random() * 10),
		desc: `Adds ${Math.ceil(Math.random() * 10)} ice damage`,
		textColor: "cyan"
	},
	{
		id: 3,
		power: Math.ceil(Math.random() * 10),
		desc: `Adds ${Math.ceil(Math.random() * 10)} earth damage`,
		textColor: "green"
	}
];

export function getInventory() {
	return resources;
}

export function getWeapons() {
	return weapons;
}

export function getStat(id) {
	return stats.find(stat => stat.id === id);
}
