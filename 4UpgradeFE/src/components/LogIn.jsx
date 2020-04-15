import React from "react";

const LogIn = ({
	handleLoginSubmit,
	handleChange,
	username,
	password,
	updatePassword,
	updateUsername,
	register,
	handleSubmit,
}) => {
	return (
		<form onSubmit={handleSubmit(handleLoginSubmit)}>
			<h1 className="login-title">4Upgrade</h1>
			<label htmlFor="username"></label>
			<input
				ref={register({ required: true })}
				type="text"
				value={username}
				onChange={handleChange(updateUsername)}
				placeholder="Username"
				id="username"
				name="username"
				autoComplete="username"
			/>
			<br />
			<label htmlFor="password"></label>
			<input
				ref={register({ required: true })}
				type="password"
				value={password}
				onChange={handleChange(updatePassword)}
				id="password"
				placeholder="Password!987"
				name="password"
				autoComplete="current-password"
			/>
			<input type="submit" value="Log In" className="submit" />
			<a href="" className="forgot">
				Forgot password?
			</a>
		</form>
	);
};

export default LogIn;
