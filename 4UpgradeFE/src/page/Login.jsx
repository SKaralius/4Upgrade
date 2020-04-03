import React, { useState } from "react";
import { handleChange } from "../util/handleChange";
import http from "../services/httpService";

const LogIn = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const handleSubmit = async event => {
		event.preventDefault();
		try {
			await http.post("http://localhost:8080/users/login", {
				username,
				password
			});
			alert("you are loged in");
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
					onChange={event => handleChange(event, setUsername)}
					id="username"
					name="username"
				/>
				<br />
				<label htmlFor="password">Password: </label>
				<input
					type="password"
					value={password}
					onChange={event => handleChange(event, setPassword)}
					id="password"
					name="password"
				/>
				<br />
				<input type="submit" value="Submit"></input>
			</form>
		</React.Fragment>
	);
};

export default LogIn;
