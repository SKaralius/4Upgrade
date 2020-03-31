const db = require("../util/dbConnect");

exports.getResources = (req, res, next) => {
	db.query(
		"SELECT * FROM person WHERE first_name = $1",
		["Omar"],
		(err, result) => {
			if (err) {
				return next(err);
			}
			res.status(200).send(result.rows[0]);
		}
	);

	// const resources = await Resource.find();
	// res.status(200).json({ resources });
};
