import React, { useState } from "react";
import { handleChange } from "../util/handleChange";
import http from "../services/httpService";

const Register = () => {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const handleSubmit = async (event) => {
		event.preventDefault();
		try {
			await http.post(process.env.REACT_APP_IP + "users/adduser", {
				username,
				email,
				password,
			});
			alert("User Created");
		} catch (err) {
			if (err.response && err.response.status === 403) {
				alert(err.response.data.message);
			}
		}
	};
	return (
		<React.Fragment>
			<h1>Register</h1>
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
				<label htmlFor="email">Email: </label>
				<input
					type="text"
					value={email}
					onChange={(event) => handleChange(event, setEmail)}
					id="email"
					name="email"
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
				<button type="submit">Submit</button>
			</form>
		</React.Fragment>
	);
};

export default Register;
