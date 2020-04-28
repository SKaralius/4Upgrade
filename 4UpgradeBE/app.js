require("dotenv").config();
const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const bodyParser = require("body-parser");
const inventoryRoutes = require("./routes/inventory");
const weaponRoutes = require("./routes/weapons");
const userRoutes = require("./routes/users");
const upgradeRoutes = require("./routes/upgrade");
const combatRoutes = require("./routes/combat");

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

const accessLogStream = fs.createWriteStream(
	path.join(__dirname, "access.log"),
	{
		flags: "a",
	}
);
app.use(morgan("combined", { stream: accessLogStream }));
// app.use("/resources", resourceRoutes);
app.use("/weapons", weaponRoutes);
app.use("/users", userRoutes);
app.use("/inventory", inventoryRoutes);
app.use("/upgrade", upgradeRoutes);
app.use("/combat", combatRoutes);

app.use(helmet());
app.use(compression());

app.use((error, req, res, next) => {
	const { message } = error;
	const statusCode = error.statusCode || 500;
	res.status(statusCode).json({ status: "Error", statusCode, message });
});

const port = process.env.PORT || 8080;
try {
	app.listen(port);
	console.log(`listening on port ${port}`);
} catch (err) {
	console.log(err);
}
