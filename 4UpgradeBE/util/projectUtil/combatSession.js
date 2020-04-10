// TODO: MEMORY LEAK!!! Is storing sessions in an object appropriate?
// is it possible to delete a session when JWT expires?
// I can call server from FE to delete the session on logout, but what
// if user just navigates away?
let session = {};

function getSession(username) {
	if (session[username]) {
		return session[username];
	} else {
		session[username] = { health: 500 };
		return session[username];
	}
}

function dealDamage(username) {
	session[username].health -= 250;
	return session[username];
}

function deleteSession(username) {
	delete session[username];
}

module.exports = { getSession, dealDamage, deleteSession };
