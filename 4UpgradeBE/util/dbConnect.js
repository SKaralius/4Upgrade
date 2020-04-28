const { Pool } = require("pg");
const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	application_name: "4Upgrade",
	max: 20,
	idleTimeoutMillis: 30000,
	connectionTimeoutMillis: 2000,
});

module.exports = {
	query: async (text, params) => {
		//const start = Date.now();
		const result = await pool.query(text, params);
		//const duration = Date.now() - start;
		// console.log("executed query", {
		// 	text,
		// 	duration,
		// 	rows: result.rowCount,
		// });
		return result;
	},
};
