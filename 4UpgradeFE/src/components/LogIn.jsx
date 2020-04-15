import React from "react";

const LogIn = ({
	handleLoginSubmit,
	// React Hook Form
	register,
	handleSubmit,
	errors,
}) => {
	return (
		<form onSubmit={handleSubmit(handleLoginSubmit)}>
			<h1 className="login-title">4Upgrade</h1>
			<input
				ref={register({
					required: true,
					minLength: {
						value: 2,
						message:
							"Usernames have to have at least 2 characters.",
					},
					pattern: {
						value: /^[a-zA-Z0-9_]*$/,
						message:
							"Usernames are not allowed to have special symbols.",
					},
				})}
				placeholder="Username"
				name="username"
				autoComplete="username"
			/>
			<br />
			{errors.username && <span>{errors.username.message}</span>}
			<input
				ref={register({
					required: {
						value: true,
						message: "Password is required.",
					},
				})}
				type="password"
				placeholder="Password!987"
				name="password"
				autoComplete="current-password"
			/>
			<br />
			{errors.password && <span>{errors.password.message}</span>}
			<input type="submit" value="Log In" className="submit" />
		</form>
	);
};

export default LogIn;
