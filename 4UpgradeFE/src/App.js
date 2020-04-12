import React, { useState, useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import http from "./services/httpService";

import Navbar from "./common/Navbar";
import Items from "./page/Items";
import Register from "./page/Register";
import LogIn from "./page/LogIn";
import Arena from "./page/Arena";

function App() {
	const [weaponInventory, setWeaponInventory] = useState([]);
	const [weaponStats, setWeaponStats] = useState([]);
	const [isAuth, setIsAuth] = useState(false);

	const token = localStorage.getItem("token");
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
				console.log(weaponInventoryResult);
				if (weaponInventoryResult.data.length === 0) {
					setWeaponInventory(weaponInventoryResult.data);
					return;
				}
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
	}, [token]);
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
						<Arena {...props} weaponInventory={weaponInventory} />
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
