const { Pool } = require("pg");
const pool = new Pool({
	host: "localhost", // server name or IP address;
	application_name: "Project-04-03",
	port: 5432,
	database: "forupgrade",
	user: "postgres",
	password: process.env.DB_PASS,
	max: 20,
	idleTimeoutMillis: 30000,
	connectionTimeoutMillis: 2000,
});

module.exports = {
	query: async (text, params) => {
		const start = Date.now();
		const result = await pool.query(text, params);
		const duration = Date.now() - start;
		// console.log("executed query", {
		// 	text,
		// 	duration,
		// 	rows: result.rowCount,
		// });
		return result;
	},
};
