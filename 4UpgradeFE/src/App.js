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
	const [selectedWeapon, setSelectedWeapon] = useState({});
	const [weaponStats, setWeaponStats] = useState([]);
	const [weaponsDetails, setWeaponsDetails] = useState([]);
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
							Authorization: "Bearer " + token,
						},
					}
				);
				if (weaponInventoryResult.data.length === 0) return;
				else {
					const unresolvedPromises = await weaponInventoryResult.data.map(
						async (weapon) => {
							const weaponDataResult = await http.get(
								process.env.REACT_APP_IP +
									"weapons/getWeapon/" +
									weapon.weapon_entry_uid,
								{
									headers: {
										Authorization: "Bearer " + token,
									},
								}
							);
							weaponDataResult.data.weapon_entry_uid =
								weapon.weapon_entry_uid;
							return weaponDataResult.data;
						}
					);
					const resolvedPromises = await Promise.all(
						unresolvedPromises
					);
					setWeaponsDetails(resolvedPromises);
					setSelectedWeapon(resolvedPromises[0]);
				}
			} else {
				updateAuth(false);
			}
		}
		fetchData();
	}, [token, isAuth]);
	useEffect(() => {
		async function fetchData() {
			const weaponStatsResult = await http.get(
				process.env.REACT_APP_IP +
					"weapons/getWeaponStats/" +
					selectedWeapon.weapon_entry_uid,
				{
					headers: {
						Authorization: "Bearer " + token,
					},
				}
			);
			setWeaponStats(weaponStatsResult.data);
		}
		fetchData();
	}, [selectedWeapon]);
	const updateWeaponStats = (newStats) => {
		setWeaponStats(newStats);
	};
	const updateAuth = (newAuth) => {
		setIsAuth(newAuth);
	};
	const updateWeaponsDetails = (newDetails) => {
		console.log(newDetails);
		if (newDetails.length > 4 || newDetails.length < 1) {
			return false;
		} else {
			setWeaponsDetails(newDetails);
			return true;
		}
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
							selectedWeapon={selectedWeapon}
							weaponsDetails={weaponsDetails}
							updateWeaponsDetails={updateWeaponsDetails}
							token={token}
						/>
					)}
				></Route>
				<Route
					path="/items"
					render={(props) => (
						<Items
							{...props}
							selectedWeapon={selectedWeapon}
							setSelectedWeapon={setSelectedWeapon}
							weaponsDetails={weaponsDetails}
							updateWeaponsDetails={updateWeaponsDetails}
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
