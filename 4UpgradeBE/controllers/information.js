const Weapon = require("../models/weapon");

exports.getInformation = (req, res, next) => {
	res.status(200).json({
		message: "Hello world",
		name: "Simonas",
		occupation: "Programmer",
		mood: "kms"
	});
};

exports.sendInformation = (req, res, next) => {
	console.log(req.body.title);
	res.status(200).json({
		message: `POST request received: ${req.body.title}`
	});
};

exports.sendWeapon = (req, res, next) => {
	const name = req.body.name;
	const imgUrl = "../img/placeholder.png";
	const power = Math.ceil(Math.random() * 10);
	const weaponStats = [
		{ _id: 1, power, desc: `Adds ${power} fire damage`, textColor: "red" },
		{
			_id: 2,
			power: Math.ceil(Math.random() * 10),
			desc: `Adds ${Math.ceil(Math.random() * 10)} ice damage`,
			textColor: "cyan"
		},
		{
			_id: 3,
			power: Math.ceil(Math.random() * 10),
			desc: `Adds ${Math.ceil(Math.random() * 10)} earth damage`,
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
