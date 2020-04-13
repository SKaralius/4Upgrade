import React from "react";

const Register = ({
	handleRegisterSubmit,
	handleChange,
	username,
	password,
	email,
	updateUsername,
	updatePassword,
	updateEmail,
}) => {
	return (
		<React.Fragment>
			<h1>Register</h1>
			<form onSubmit={handleRegisterSubmit}>
				<label htmlFor="username"></label>
				<input
					type="text"
					value={username}
					onChange={(event) => handleChange(event, updateUsername)}
					id="username"
					name="username"
					placeholder="Username"
					autoComplete="username"
				/>
				<br />
				<label htmlFor="email"></label>
				<input
					type="text"
					value={email}
					onChange={(event) => handleChange(event, updateEmail)}
					id="email"
					name="email"
					placeholder="username@email.xyz"
				/>
				<br />
				<label htmlFor="password"></label>
				<input
					type="password"
					value={password}
					onChange={(event) => handleChange(event, updatePassword)}
					id="password"
					name="password"
					autoComplete="current-password"
					placeholder="Password!987"
				/>
				<br />
				<input
					type="submit"
					value="Register"
					className="submit"
				></input>
			</form>
		</React.Fragment>
	);
};

export default Register;
