require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");
const inventoryRoutes = require("./routes/inventory");
const weaponRoutes = require("./routes/weapons");
const userRoutes = require("./routes/users");

app.use(bodyParser.json());
app.use("/img", express.static(path.join(__dirname, "img")));
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

// app.use("/resources", resourceRoutes);
app.use("/weapons", weaponRoutes);
app.use("/users", userRoutes);
app.use("/inventory", inventoryRoutes);

app.use((error, req, res, next) => {
	const status = error.statusCode || 500;
	const message = error.message;
	const data = error.data;
	res.status(status).json({ message });
});

const port = 8080;

try {
	app.listen(port);
	console.log(`listening on port ${port}`);
} catch (err) {
	console.log(err);
}
