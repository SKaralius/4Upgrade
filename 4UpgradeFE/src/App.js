import React, { useState, useEffect, useCallback } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import http from "./services/httpService";
import axios from "axios";
import tokens from "./services/tokens";

import Navbar from "./common/Navbar";
import Items from "./page/Items";
import Authenticate from "./page/Authenticate";
import Arena from "./page/Arena";
import InfoBox from "./components/InfoBox";
import Footer from "./common/Footer";
import NotFound from "./page/NotFound";

function App() {
	const [weaponStatsLoading, setWeaponStatsLoading] = useState(false);
	const [selectedWeapon, setSelectedWeapon] = useState({});
	const [weaponStats, setWeaponStats] = useState([]);
	const [weaponsDetails, setWeaponsDetails] = useState([]);
	const [isAuth, setIsAuth] = useState(false);
	const [token, setToken] = useState("");
	const [messageInfo, setMessageInfo] = useState({});
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
			setWeaponStatsLoading(true);
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
			setWeaponStatsLoading(false);
		}
		if (selectedWeapon.weapon_entry_uid) {
			fetchData();
		}
	}, [selectedWeapon, token]);
	const updateWeaponStats = (newStats) => {
		setWeaponStats(newStats);
	};
	const updateAuth = (newAuth) => {
		setIsAuth(newAuth);
	};
	const updateWeaponsDetails = useCallback(
		(newDetails) => {
			if (newDetails.length > 4 || newDetails.length < 1) {
				return false;
			} else {
				setWeaponsDetails(newDetails);
				return true;
			}
		},
		[setWeaponsDetails]
	);
	const updateMessageInfo = useCallback(
		(newInfo) => {
			setMessageInfo(newInfo);
		},
		[setMessageInfo]
	);
	const updateWeaponStatsLoading = (value) => {
		setWeaponStatsLoading(value);
	};
	const updateSelectedWeapon = (value) => {
		setSelectedWeapon(value);
	};
	return (
		<div className="page">
			<Navbar isAuth={isAuth} updateAuth={updateAuth} />
			{messageInfo.message ? (
				<InfoBox
					message={messageInfo.message}
					imgurl={messageInfo.imgurl}
					success={messageInfo.success}
					updateMessageInfo={updateMessageInfo}
				/>
			) : null}
			<Switch>
				<Route exact path="/">
					{localStorage.getItem("token") ? (
						<Redirect to="/items" />
					) : (
						<Redirect to="/authenticate" />
					)}
				</Route>
				<Route
					path="/arena"
					render={(props) => (
						<Arena
							{...props}
							selectedWeapon={selectedWeapon}
							weaponsDetails={weaponsDetails}
							updateWeaponsDetails={updateWeaponsDetails}
							updateMessageInfo={updateMessageInfo}
							token={token}
						/>
					)}
				/>
				<Route
					path="/items"
					render={(props) => (
						<Items
							{...props}
							weaponStatsLoading={weaponStatsLoading}
							updateMessageInfo={updateMessageInfo}
							selectedWeapon={selectedWeapon}
							updateSelectedWeapon={updateSelectedWeapon}
							updateWeaponStatsLoading={updateWeaponStatsLoading}
							weaponsDetails={weaponsDetails}
							updateWeaponsDetails={updateWeaponsDetails}
							updateWeaponStats={updateWeaponStats}
							weaponStats={weaponStats}
							token={token}
						/>
					)}
				/>
				<Route
					path="/Authenticate"
					render={(props) => (
						<Authenticate
							{...props}
							updateSelectedWeapon={updateSelectedWeapon}
							updateAuth={updateAuth}
							updateMessageInfo={updateMessageInfo}
						/>
					)}
				/>
				<Route path="*" component={NotFound} />
			</Switch>
			<Footer isAuth={isAuth} updateAuth={updateAuth} />
		</div>
	);
}

export default App;
