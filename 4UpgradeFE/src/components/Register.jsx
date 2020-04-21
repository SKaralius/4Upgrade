import React from "react";

import FormError from "../components/FormError";

const Register = ({
	handleRegisterSubmit,
	// React Hook Form
	register,
	handleSubmit,
	errors,
}) => {
	return (
		<form onSubmit={handleSubmit(handleRegisterSubmit)}>
			<h1>Register</h1>
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
			<input
				ref={register({
					required: { value: true, message: "Email is required." },
					pattern: {
						value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
						message: "Invalid email address",
					},
				})}
				name="emailRegister"
				placeholder="username@email.xyz"
				autoComplete="email"
			/>
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
			<div className="formErrorContainer">
				<FormError error={errors.usernameRegister} />
				<FormError error={errors.emailRegister} />
				<FormError error={errors.passwordRegister} />
			</div>
			<input type="submit" value="Register" className="submit"></input>
		</form>
	);
};

export default Register;
