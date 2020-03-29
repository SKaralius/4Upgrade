const mongoose = require("mongoose");

exports.dbConnect = async function connect() {
	await mongoose.connect(process.env.DB_CONN, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	});
};
