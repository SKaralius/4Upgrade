const Resource = require("../models/resource");

exports.getResources = async (req, res, next) => {
	const resources = await Resource.find();
	res.status(200).json({ resources });
};
