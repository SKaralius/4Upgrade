import React, { useState, useEffect } from "react";
import { handleChange } from "../util/handleChange";
import http from "../services/httpService";

const LogIn = ({ updateAuth, history }) => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	useEffect(() => {
		localStorage.setItem("username", username);
	}, [username]);
	const handleSubmit = async (event) => {
		event.preventDefault();
		try {
			const { data } = await http.post(
				process.env.REACT_APP_IP + "users/login",
				{
					username,
					password,
				}
			);
			updateAuth(true);
			localStorage.setItem("token", data.token);
			setUsername(data.username);
			history.push("/items");
		} catch (err) {
			if (err.response && err.response.status === 401) {
				alert(err.response.data.message);
			}
		}
	};
	return (
		<React.Fragment>
			<h1>Log In</h1>
			<form onSubmit={handleSubmit}>
				<label htmlFor="username">Username: </label>
				<input
					type="text"
					value={username}
					onChange={(event) => handleChange(event, setUsername)}
					id="username"
					name="username"
					autoComplete="username"
				/>
				<br />
				<label htmlFor="password">Password: </label>
				<input
					type="password"
					value={password}
					onChange={(event) => handleChange(event, setPassword)}
					id="password"
					name="password"
					autoComplete="current-password"
				/>
				<br />
				<input type="submit" value="Submit"></input>
			</form>
		</React.Fragment>
	);
};

export default LogIn;
