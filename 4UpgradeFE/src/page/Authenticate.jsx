import React, { useState, useEffect } from "react";
import { handleChange } from "../util/handleChange";
import { useForm } from "react-hook-form";

import http from "../services/httpService";
import LogIn from "../components/LogIn";
import Register from "../components/Register";

const Authenticate = ({ updateAuth, history }) => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [email, setEmail] = useState("");
	const [selectedForm, setSelectedForm] = useState("Log In");
	const { register, handleSubmit } = useForm();
	useEffect(() => {
		localStorage.setItem("username", username);
	}, [username]);
	const handleLoginSubmit = async (event) => {
		event.preventDefault();
		try {
			const { data } = await http.post(
				process.env.REACT_APP_IP + "users/login",
				{
					username,
					password,
				}
			);
			const remainingMilliseconds = 60 * 60 * 1000;
			const expiryDate = new Date(
				new Date().getTime() + remainingMilliseconds
			);
			localStorage.setItem("expiryDate", expiryDate.toISOString());
			updateAuth(true);
			localStorage.setItem("token", data.accessToken);
			localStorage.setItem("refreshToken", data.refreshToken);
			setUsername(data.username);
			history.push("/items");
		} catch (err) {
			if (err.response && err.response.status === 401) {
				alert(err.response.data.message);
			}
		}
	};
	const handleRegisterSubmit = async (event) => {
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
	const updateEmail = (value) => {
		setEmail(value);
	};
	const updatePassword = (value) => {
		setPassword(value);
	};
	const updateUsername = (value) => {
		setUsername(value);
	};
	console.log("leak?");
	return (
		<div className="login-wrap">
			<div className="login-form">
				<div className="form-select">
					<label
						className={selectedForm === "Log In" ? "selected" : ""}
					>
						<input
							type="radio"
							value="Log In"
							checked={selectedForm === "Log In"}
							onChange={handleChange(setSelectedForm)}
							hidden
						/>
						Log In
					</label>

					<label
						className={
							selectedForm === "Register" ? "selected" : ""
						}
					>
						<input
							type="radio"
							value="Register"
							checked={selectedForm === "Register"}
							onChange={handleChange(setSelectedForm)}
							hidden
						/>
						Register
					</label>
				</div>
				{selectedForm === "Log In" ? (
					<LogIn
						handleLoginSubmit={handleLoginSubmit}
						handleChange={handleChange}
						username={username}
						password={password}
						updatePassword={updatePassword}
						updateUsername={updateUsername}
						// React hook form
						register={register}
						handleSubmit={handleSubmit}
					/>
				) : (
					<Register
						handleRegisterSubmit={handleRegisterSubmit}
						handleChange={handleChange}
						username={username}
						password={password}
						email={email}
						updateEmail={updateEmail}
						updatePassword={updatePassword}
						updateUsername={updateUsername}
					/>
				)}
			</div>
		</div>
	);
};

export default Authenticate;
