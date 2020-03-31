const { Pool } = require("pg");
const pool = new Pool({
	host: "localhost", // server name or IP address;
	port: 5432,
	database: "test",
	user: "postgres",
	password: process.env.DB_PASS,
	max: 20,
	idleTimeoutMillis: 30000,
	connectionTimeoutMillis: 2000
});

module.exports = {
	query: (text, params, callback) => {
		const start = Date.now();
		return pool.query(text, params, (err, res) => {
			const duration = Date.now() - start;
			console.log("executed query", {
				text,
				duration,
				rows: res.rowCount
			});
			callback(err, res);
		});
	}
};
