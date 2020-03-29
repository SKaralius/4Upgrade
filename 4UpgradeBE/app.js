const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const informationRoutes = require("./routes/information");

app.use(bodyParser.json());
// Added headers to allow cross origin
app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader(
		"Access-Control-Allow-Methods",
		"GET, POST, PUT, PATCH, DELETE"
	);
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Content-Type, Authorization"
	);
	next();
});

app.use("/information", informationRoutes);

const port = 8080;
let db;
try {
	connect();
	app.listen(port);
	console.log(`listening on port ${port}`);
} catch (err) {
	console.log(err);
}

async function connect() {
	db = await mongoose.connect("", {
		useNewUrlParser: true,
		useUnifiedTopology: true
	});
}
