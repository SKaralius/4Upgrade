import React, { useState } from "react";
import { handleChange } from "../util/handleChange";

const Register = () => {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const handleSubmit = event => {
		// Send data to back end with axios
		alert(`${username} ${email} ${password}`);
		event.preventDefault();
	};
	return (
		<React.Fragment>
			<h1>Register</h1>
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
				<label htmlFor="email">Email: </label>
				<input
					type="text"
					value={email}
					onChange={event => handleChange(event, setEmail)}
					id="email"
					name="email"
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
				<button type="submit">Submit</button>
			</form>
		</React.Fragment>
	);
};

export default Register;
