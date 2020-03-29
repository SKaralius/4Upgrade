const items = [
	{
		id: 1,
		name: "Weapon Elixir",
		url: "http://localhost:8080/img/weapone.png"
	},
	{
		id: 2,
		name: "Lucky Powder",
		url: "http://localhost:8080/img/luckyp.png"
	},
	{
		id: 3,
		name: "Lucky Stone",
		url: "http://localhost:8080/img/luckys.png"
	},
	{
		id: 4,
		name: "Astral Stone",
		url: "http://localhost:8080/img/astals.png"
	}
];

export function getItems() {
	return items;
}

export function getItem(id) {
	return items.find(m => m.id === id);
}
