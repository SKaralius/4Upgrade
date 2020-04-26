import React from "react";

import FormError from "../components/FormError";

const LogIn = ({
	handleLoginSubmit,
	// React Hook Form
	register,
	handleSubmit,
	errors,
}) => {
	return (
		<form onSubmit={handleSubmit(handleLoginSubmit)}>
			<input
				ref={register({
					required: {
						value: true,
						message: "Username is required.",
					},
					minLength: {
						value: 2,
						message:
							"Usernames have to have at least 2 characters.",
					},
					pattern: {
						value: /^[a-zA-Z0-9]*$/,
						message:
							"Usernames are not allowed to have special symbols.",
					},
				})}
				placeholder="Username"
				name="username"
				autoComplete="username"
			/>
			<br />

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
			<div className="formErrorContainer">
				<FormError error={errors.username} />
				<FormError error={errors.password} />
			</div>
			<input type="submit" value="Log In" className="submit" />
		</form>
	);
};

export default LogIn;
