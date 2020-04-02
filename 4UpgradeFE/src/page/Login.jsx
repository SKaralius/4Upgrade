import React, { useState } from "react";
import { handleChange } from "../util/handleChange";

const Login = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const handleSubmit = event => {
		// Send data to back end with axios
		alert(`${username} ${password}`);
		event.preventDefault();
	};
	return (
		<React.Fragment>
			<h1>Login</h1>
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
					type="text"
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

export default Login;
