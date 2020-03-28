const items = [
	{
		id: 1,
		name: "Weapon Elixir",
		url: "./img/weapone.png"
	},
	{
		id: 2,
		name: "Lucky Powder",
		url: "./img/luckyp.png"
	},
	{
		id: 3,
		name: "Lucky Stone",
		url: "./img/luckys.png"
	},
	{
		id: 4,
		name: "Astral Stone",
		url: "./img/astals.png"
	}
];

export function getItems() {
	return items;
}

export function getItem(id) {
	return items.find(m => m.id === id);
}
