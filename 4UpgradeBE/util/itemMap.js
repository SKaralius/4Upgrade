let items = new Map();
items.set("Weapon Elixir", "a5b5bff3-1ec1-4a94-b998-5394772158ba");
items.set("Astal Stone", "3f7d57cd-27b2-4759-9b57-bf56f30ce9d0");

function getItem(name) {
	return items[name];
}

module.exports = {
	getItem,
};
