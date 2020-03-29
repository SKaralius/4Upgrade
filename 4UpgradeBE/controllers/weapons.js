const Weapon = require("../models/weapon");

exports.sendWeapon = (req, res, next) => {
	const name = req.body.name;
	const imgUrl = "http://localhost:8080/img/placeholder.png";
	function rollPower() {
		return Math.ceil(Math.random() * 10);
	}
	const power1 = rollPower();
	const power2 = rollPower();
	const power3 = rollPower();
	const weaponStats = [
		{
			_id: 1,
			power: power1,
			desc: `Adds ${power1} fire damage`,
			textColor: "red"
		},
		{
			_id: 2,
			power: power2,
			desc: `Adds ${power2} ice damage`,
			textColor: "cyan"
		},
		{
			_id: 3,
			power: power3,
			desc: `Adds ${power3} earth damage`,
			textColor: "green"
		}
	];
	const weapon = new Weapon({
		name,
		imgUrl,
		weaponStats
	});
	weapon.save();
	res.status(200).json({ message: "Weapon saved successfully" });
};

exports.getWeapons = async (req, res, next) => {
	const weapons = await Weapon.find();
	res.status(200).json({ weapons });
};
