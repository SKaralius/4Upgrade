import React, { useState, useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import http from "./services/httpService";
import tokens from "./services/tokens";

import Navbar from "./common/Navbar";
import Items from "./page/Items";
import Register from "./page/Register";
import LogIn from "./page/LogIn";
import Arena from "./page/Arena";
import axios from "axios";

function App() {
	const [weaponInventory, setWeaponInventory] = useState([]);
	const [weaponStats, setWeaponStats] = useState([]);
	const [isAuth, setIsAuth] = useState(false);
	const [token, setToken] = useState("");
	axios.interceptors.request.use(async (request) => {
		const remainingMilliseconds = 60 * 60 * 1000;
		const expiryDate = new Date(
			new Date().getTime() + remainingMilliseconds
		);
		const dateNow = new Date().getTime();
		localStorage.setItem("expiryDate", expiryDate.toISOString());
		if (localStorage.getItem("expiryDate") - dateNow <= 0) {
			const expiryDate = Date.now() + 1000 * 3600;
			localStorage.setItem("expiryDate", expiryDate);
			const newToken = await tokens.getAccessToken();
			request.Authorization = `Bearer ${newToken}`;
			setToken(newToken);
		}
		return request;
	});
	useEffect(() => {
		setToken(localStorage.getItem("token"));
	}, [isAuth]);
	useEffect(() => {
		async function fetchData() {
			if (token) {
				updateAuth(true);
				const weaponInventoryResult = await http.get(
					process.env.REACT_APP_IP + "inventory/getweaponInventory/",
					{
						headers: {
							Authorization: "Bearer " + token, //the token is a variable which holds the token
						},
					}
				);
				if (weaponInventoryResult.data.status === "Error") return;
				const weaponStatsResult = await http.get(
					process.env.REACT_APP_IP +
						"weapons/getWeaponStats/" +
						weaponInventoryResult.data[0].weapon_uid,
					{
						headers: {
							Authorization: "Bearer " + token, //the token is a variable which holds the token
						},
					}
				);
				setWeaponInventory(weaponInventoryResult.data);
				setWeaponStats(weaponStatsResult.data);
			} else {
				updateAuth(false);
			}
		}
		fetchData();
		return setWeaponInventory([]);
	}, [token, isAuth]);
	const updateWeaponStats = (newStats) => {
		setWeaponStats(newStats);
	};
	const updateAuth = (newAuth) => {
		setIsAuth(newAuth);
	};
	return (
		<React.Fragment>
			<Navbar isAuth={isAuth} updateAuth={updateAuth} />
			<hr />
			<Switch>
				<Route path="/register" component={Register}></Route>
				<Route
					path="/arena"
					render={(props) => (
						<Arena
							{...props}
							weaponInventory={weaponInventory}
							token={token}
						/>
					)}
				></Route>
				<Route
					path="/items"
					render={(props) => (
						<Items
							{...props}
							weaponInventory={weaponInventory}
							updateWeaponStats={updateWeaponStats}
							weaponStats={weaponStats}
							token={token}
						/>
					)}
				></Route>
				<Route
					path="/login"
					render={(props) => (
						<LogIn {...props} updateAuth={updateAuth} />
					)}
				/>
			</Switch>
		</React.Fragment>
	);
}

export default App;
