import React, { useEffect, useState } from "react";
import http from "../services/httpService";

import Inventory from "../components/Inventory";
import Item from "../components/Item";
import Transfer from "../components/Transfer";

const Items = () => {
	const [weapon, setWeapon] = useState([]);
	const [weaponInventory, setWeaponInventory] = useState([]);
	const [weaponStats, setWeaponStats] = useState([]);
	const [hasLoaded, setHasLoaded] = useState(false);
	const token = localStorage.getItem("token");
	const fetchWeaponInventory = async () => {
		const { data } = await http.get(
			"http://localhost:8080/inventory/getweaponInventory/",
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
			"http://localhost:8080/weapons/getWeaponStats/" + weapon_uid,
			{
				headers: {
					Authorization: "Bearer " + token, //the token is a variable which holds the token
				},
			}
		);
		return data;
	};
	const fetchWeapon = async (weapon_uid) => {
		const { data } = await http.get(
			"http://localhost:8080/weapons/getWeapon/" + weapon_uid,
			{
				headers: {
					Authorization: "Bearer " + token, //the token is a variable which holds the token
				},
			}
		);
		return data[0];
	};
	useEffect(() => {
		setHasLoaded(false);
		async function fetchData() {
			const unresolvedPromise = await fetchWeaponInventory();
			const resolvedPromise = await Promise.all(unresolvedPromise);
			const weaponData = await fetchWeapon(resolvedPromise[0].weapon_uid);
			const weaponStatsResult = await fetchWeaponStats(
				resolvedPromise[0].weapon_uid
			);
			setWeapon(weaponData);
			setWeaponStats(weaponStatsResult);
			setWeaponInventory(resolvedPromise);
			setHasLoaded(true);
		}
		fetchData();
	}, []);
	return (
		<React.Fragment>
			{hasLoaded ? (
				weaponInventory.length !== 0 ? (
					<div>
						<Item
							weaponInventory={weaponInventory}
							weaponStats={weaponStats}
							weapon={weapon}
							hasLoaded={hasLoaded}
						/>
						<Transfer
							weaponInventory={weaponInventory}
							weaponStats={weaponStats}
							setWeaponStats={setWeaponStats}
							fetchWeaponStats={fetchWeaponStats}
						/>
					</div>
				) : (
					<h1>You don't have a weapon</h1>
				)
			) : (
				<h1>Loading...</h1>
			)}

			<hr />
			<Inventory />
		</React.Fragment>
	);
};

export default Items;
