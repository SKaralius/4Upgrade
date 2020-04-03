import axios from "axios";

axios.interceptors.response.use(null, error => {
	const expectedError =
		error.response &&
		error.response.status >= 400 &&
		error.response.status < 500;
	if (!expectedError) {
		console.log("Loggin the error", error);
		alert("An unexpected error has occured", error);
	} else if (error.response.status === 404) {
		console.log("Loggin the error", error);
		alert("A page not found error", error);
	}
	return Promise.reject(error);
});

export default {
	get: axios.get,
	post: axios.post,
	put: axios.put,
	delete: axios.delete
};
