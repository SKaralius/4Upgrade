const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const weaponSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	//TODO: baseType will have to reference a weapon base type model, which will translate
	//an id into a base type name + weaponImageUrl
	baseType: {
		type: Number
	},
	imgUrl: String,
	//TODO: weaponStats will have to reference a weapon stat type model, which will translate
	//an id into a weapon stat
	weaponStats: [
		{
			_id: Number,
			power: Number,
			desc: String,
			textColor: String
		}
	]
});

module.exports = mongoose.model("Weapon", weaponSchema);
