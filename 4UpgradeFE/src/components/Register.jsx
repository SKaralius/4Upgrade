import React from "react";

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
				name="usernameRegister"
				placeholder="Username"
				autoComplete="username"
			/>
			<br />
			{errors.usernameRegister && (
				<span>{errors.usernameRegister.message}</span>
			)}
			<input
				ref={register({
					required: { value: true, message: "Email is required." },
				})}
				name="emailRegister"
				placeholder="username@email.xyz"
				autoComplete="email"
			/>
			<br />
			{errors.emailRegister && (
				<span>{errors.emailRegister.message}</span>
			)}
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
			{errors.passwordRegister && (
				<span>{errors.passwordRegister.message}</span>
			)}
			<input type="submit" value="Register" className="submit"></input>
		</form>
	);
};

export default Register;
