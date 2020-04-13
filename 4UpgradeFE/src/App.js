import React, { useState, useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import http from "./services/httpService";
import tokens from "./services/tokens";

import Navbar from "./common/Navbar";
import Items from "./page/Items";
import Authenticate from "./page/Authenticate";
import Arena from "./page/Arena";
import axios from "axios";

function App() {
	const [weaponInventory, setWeaponInventory] = useState([]);
	const [weaponStats, setWeaponStats] = useState([]);
	const [isAuth, setIsAuth] = useState(false);
	const [token, setToken] = useState("");
	axios.interceptors.request.use(async (request) => {
		const currentExpiryDate = localStorage.getItem("expiryDate");
		if (new Date(currentExpiryDate) <= new Date()) {
			const expiryDate = new Date(new Date().getTime() + 60 * 60 * 1000);
			localStorage.setItem("expiryDate", expiryDate.toISOString());
			const newToken = await tokens.getAccessToken();
			request.Authorization = `Bearer ${newToken}`;
			setToken(newToken);
		}
		return request;
	});
	useEffect(() => {
		if (token) {
			localStorage.setItem("token", token);
		}
	}, [token]);
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
			<Switch>
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
					path="/Authenticate"
					render={(props) => (
						<Authenticate {...props} updateAuth={updateAuth} />
					)}
				/>
			</Switch>
		</React.Fragment>
	);
}

export default App;
