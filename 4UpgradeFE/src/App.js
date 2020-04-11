import React, { useState, useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import http from "./services/httpService";

import Navbar from "./common/Navbar";
import Items from "./page/Items";
import Register from "./page/Register";
import LogIn from "./page/LogIn";
import Arena from "./page/Arena";

function App() {
	const [weaponStats, setWeaponStats] = useState([]);
	const [isAuth, setIsAuth] = useState(false);
	const [weaponInventory, setWeaponInventory] = useState([]);
	const [loading, setLoading] = useState(true);
	const token = localStorage.getItem("token");
	useEffect(() => {
		async function fetchData() {
			setLoading(true);
			if (token) {
				setIsAuth(true);
				const weaponInventoryData = await fetchWeaponInventory();
				const weaponStatsData = await fetchWeaponStats(
					weaponInventoryData[0].weapon_uid
				);
				setWeaponInventory(weaponInventoryData);
				setWeaponStats(weaponStatsData);
			} else {
				setIsAuth(false);
			}
			setLoading(false);
		}
		fetchData();
	}, [token]);
	const fetchWeaponInventory = async () => {
		const { data } = await http.get(
			process.env.REACT_APP_IP + "inventory/getweaponInventory/",
			{
				headers: {
					Authorization: "Bearer " + token, //the token is a variable which holds the token
				},
			}
		);
		return data;
	};
	const fetchWeaponStats = async (weapon_uid) => {
		const { data } = await http.get(
			process.env.REACT_APP_IP + "weapons/getWeaponStats/" + weapon_uid,
			{
				headers: {
					Authorization: "Bearer " + token, //the token is a variable which holds the token
				},
			}
		);
		return data;
	};
	return loading ? (
		<h1>Loading...</h1>
	) : (
		<React.Fragment>
			<Navbar isAuth={isAuth} setIsAuth={setIsAuth} />
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
							setWeaponInventory={setWeaponInventory}
							setWeaponStats={setWeaponStats}
							weaponStats={weaponStats}
							fetchWeaponStats={fetchWeaponStats}
						/>
					)}
				></Route>
				<Route
					path="/login"
					render={(props) => (
						<LogIn {...props} setIsAuth={setIsAuth} />
					)}
				/>
			</Switch>
		</React.Fragment>
	);
}

export default App;
