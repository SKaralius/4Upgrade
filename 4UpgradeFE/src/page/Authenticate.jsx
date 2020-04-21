import React, { useState } from "react";
import { handleChange } from "../util/handleChange";
import { useForm } from "react-hook-form";

import http from "../services/httpService";
import LogIn from "../components/LogIn";
import Register from "../components/Register";

const Authenticate = ({ updateAuth, history, updateMessageInfo }) => {
	const [selectedForm, setSelectedForm] = useState("Log In");
	const { register, handleSubmit, errors } = useForm();
	const handleLoginSubmit = async (userInfo) => {
		try {
			const { data } = await http.post(
				process.env.REACT_APP_IP + "users/login",
				{
					username: userInfo.username,
					password: userInfo.password,
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
			history.push("/items");
		} catch (err) {
			if (err.response && err.response.status === 401) {
				updateMessageInfo({
					message: err.response.data.message,
					success: false,
				});
			}
		}
	};
	const handleRegisterSubmit = async (userInfo) => {
		try {
			await http.post(process.env.REACT_APP_IP + "users/adduser", {
				username: userInfo.usernameRegister,
				email: userInfo.emailRegister,
				password: userInfo.passwordRegister,
			});
			userInfo.username = userInfo.usernameRegister;
			userInfo.password = userInfo.passwordRegister;
			handleLoginSubmit(userInfo);
		} catch (err) {
			if (err.response && err.response.status === 403) {
				updateMessageInfo({
					message: err.response.data.message,
					success: false,
				});
			}
		}
	};
	const handleDemoSubmit = async (userInfo) => {
		try {
			const { data } = await http.post(
				process.env.REACT_APP_IP + "users/demoUser"
			);
			userInfo.username = userInfo.usernameRegister;
			userInfo.password = userInfo.passwordRegister;
			const remainingMilliseconds = 60 * 60 * 1000;
			const expiryDate = new Date(
				new Date().getTime() + remainingMilliseconds
			);
			localStorage.setItem("expiryDate", expiryDate.toISOString());
			updateAuth(true);
			localStorage.setItem("token", data.accessToken);
			localStorage.setItem("refreshToken", data.refreshToken);
			history.push("/items");
		} catch (err) {
			if (err.response && err.response.status === 403) {
				updateMessageInfo({
					message: err.response.data.message,
					success: false,
				});
			}
		}
	};
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
						// React hook form
						register={register}
						handleSubmit={handleSubmit}
						errors={errors}
					/>
				) : (
					<Register
						handleRegisterSubmit={handleRegisterSubmit}
						// React hook form
						register={register}
						handleSubmit={handleSubmit}
						errors={errors}
					/>
				)}
			</div>
			<h1 className="or">Or</h1>
			<button className="demoButton" onClick={handleDemoSubmit}>
				Try a demo
			</button>
		</div>
	);
};

export default Authenticate;
