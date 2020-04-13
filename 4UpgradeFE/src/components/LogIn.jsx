import React from "react";

const LogIn = ({
	handleLoginSubmit,
	handleChange,
	username,
	password,
	updatePassword,
	updateUsername,
}) => {
	return (
		<form onSubmit={handleLoginSubmit}>
			<h1 className="login-title">4Upgrade</h1>
			<label htmlFor="username"></label>
			<input
				type="text"
				value={username}
				onChange={(event) => handleChange(event, updateUsername)}
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
				onChange={(event) => handleChange(event, updatePassword)}
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
	);
};

export default LogIn;
