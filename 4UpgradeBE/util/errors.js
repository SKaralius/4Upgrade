function throwError(statusCode, message) {
	const error = new Error();
	error.message = message;
	error.statusCode = statusCode;
	throw error;
}

module.exports = {
	throwError,
};
