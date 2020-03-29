const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const resrouceSchema = new Schema({
	_id: {
		type: Number,
		required: true
	},
	qty: {
		type: Number,
		required: true
	}
});

module.exports = mongoose.model("Resource", resrouceSchema);
