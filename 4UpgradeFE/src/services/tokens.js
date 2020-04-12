import http from "./httpService";

const getAccessToken = async () => {
	const tokenResult = await http.post(
		process.env.REACT_APP_IP + "users/token",
		{
			token: localStorage.getItem("refreshToken"),
		}
	);
	return tokenResult.data.accessToken;
};

export default {
	getAccessToken: getAccessToken,
};
