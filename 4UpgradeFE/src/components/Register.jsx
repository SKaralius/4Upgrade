import React from "react";

import FormError from "../components/FormError";

const Register = ({
	handleRegisterSubmit,
	// React Hook Form
	register,
	handleSubmit,
	errors,
	watch,
}) => {
	return (
		<form onSubmit={handleSubmit(handleRegisterSubmit)}>
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
				name="usernameRegister"
				placeholder="Username"
				autoComplete="username"
			/>
			<br />
			<input
				ref={register({
					required: {
						value: true,
						message: "Password is required.",
					},
					minLength: {
						value: 6,
						message:
							"Passwords have to have at least 6 characters.",
					},
				})}
				type="password"
				name="passwordRegister"
				autoComplete="current-password"
				placeholder="Password!987"
			/>
			<br />
			<input
				ref={register({
					required: {
						value: true,
						message: "Repeat the password.",
					},
					minLength: {
						value: 6,
						message:
							"Passwords have to have at least 6 characters.",
					},
					validate: (value) => {
						return (
							value === watch("passwordRegister") ||
							"Passwords don't match."
						);
					},
				})}
				type="password"
				name="passwordRegister2"
				placeholder="Repeat password"
			/>
			<div className="formErrorContainer">
				<FormError error={errors.usernameRegister} />
				<FormError error={errors.passwordRegister} />
				<FormError error={errors.passwordRegister2} />
			</div>
			<input type="submit" value="Register" className="submit"></input>
		</form>
	);
};

export default Register;
