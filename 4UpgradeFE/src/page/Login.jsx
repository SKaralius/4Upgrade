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
			const remainingMilliseconds = 60 * 60 * 1000;
			const expiryDate = new Date(
				new Date().getTime() + remainingMilliseconds
			);
			localStorage.setItem("expiryDate", expiryDate.toISOString());
			updateAuth(true);
			localStorage.setItem("token", data.accessToken);
			localStorage.setItem("refreshToken", data.refreshToken);
			setUsername(data.username);
			history.push("/items");
		} catch (err) {
			if (err.response && err.response.status === 401) {
				alert(err.response.data.message);
			}
		}
	};
	return (
		<div className="login-wrap">
			<form onSubmit={handleSubmit} className="login-form">
				<h1 className="login-title">4Upgrade</h1>
				<label htmlFor="username"></label>
				<input
					type="text"
					value={username}
					onChange={(event) => handleChange(event, setUsername)}
					placeholder="Username"
					id="username"
					name="username"
					autoComplete="username"
				/>
				<br />
				<label htmlFor="password"></label>
				<input
					type="password"
					value={password}
					onChange={(event) => handleChange(event, setPassword)}
					id="password"
					placeholder="Password!987"
					name="password"
					autoComplete="current-password"
				/>
				<input type="submit" value="Log In" className="submit"></input>
				<a href="" className="forgot">
					Forgot password?
				</a>
			</form>
		</div>
	);
};

export default LogIn;
