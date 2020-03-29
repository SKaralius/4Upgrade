require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { dbConnect } = require("./util/dbConnect");
const weaponRoutes = require("./routes/weapons");

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

app.use("/weapons", weaponRoutes);

dbConnect();

const port = 8080;

try {
	app.listen(port);
	console.log(`listening on port ${port}`);
} catch (err) {
	console.log(err);
}
