import React, { useEffect, useState } from "react";
import http from "../services/httpService";

import Inventory from "../components/Inventory";
import Item from "../components/Item";
import Transfer from "../components/Transfer";

const Items = () => {
	console.log();
	const [weapon, setWeapon] = useState([]);
	const [weaponInventory, setWeaponInventory] = useState([]);
	const [weaponStats, setWeaponStats] = useState([]);
	const [hasLoaded, setHasLoaded] = useState(false);
	const [transferItems, _setTransferItems] = useState([]);
	const [inventoryRows, setInventoryRows] = useState([]);
	const token = localStorage.getItem("token");
	const updateTransferItems = (value) => {
		if (value.length > 3) {
			return false;
		} else {
			_setTransferItems(value);
			return true;
		}
	};
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
	const fetchWeapon = async (weapon_uid) => {
		const { data } = await http.get(
			process.env.REACT_APP_IP + "weapons/getWeapon/" + weapon_uid,
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
			const receivedWeaponInventory = await fetchWeaponInventory();
			if (receivedWeaponInventory.length === 0) {
				setWeaponInventory(receivedWeaponInventory);
				setHasLoaded(true);
				return;
			}
			const weaponData = await fetchWeapon(
				receivedWeaponInventory[0].weapon_uid
			);
			const weaponStatsResult = await fetchWeaponStats(
				receivedWeaponInventory[0].weapon_uid
			);
			setWeapon(weaponData);
			setWeaponStats(weaponStatsResult);
			setWeaponInventory(receivedWeaponInventory);
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
							setInventoryRows={setInventoryRows}
							inventoryRows={inventoryRows}
							transferItems={transferItems}
							setTransferItems={updateTransferItems}
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
			<Inventory
				setInventoryRows={setInventoryRows}
				inventoryRows={inventoryRows}
				setTransferItems={updateTransferItems}
				transferItems={transferItems}
			/>
		</React.Fragment>
	);
};

export default Items;
