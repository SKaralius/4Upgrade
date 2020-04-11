import React, { useEffect, useState } from "react";
import http from "../services/httpService";

import Inventory from "../components/Inventory";
import Item from "../components/Item";
import Transfer from "../components/Transfer";

const Items = (props) => {
	const [weapon, setWeapon] = useState([]);

	const [hasLoaded, setHasLoaded] = useState(false);
	const [transferItems, _setTransferItems] = useState([]);
	const [inventoryRows, setInventoryRows] = useState([]);
	const token = localStorage.getItem("token");
	const updateTransferItems = (value) => {
		if (value.length > 2) {
			return false;
		} else {
			_setTransferItems(value);
			return true;
		}
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
			if (props.weaponInventory.length === 0) {
				props.setWeaponInventory(props.weaponInventory);
				setHasLoaded(true);
				return;
			}
			const weaponData = await fetchWeapon(
				props.weaponInventory[0].weapon_uid
			);

			setWeapon(weaponData);
			setHasLoaded(true);
		}
		fetchData();
	}, [props.weaponInventory]);
	return (
		<React.Fragment>
			{hasLoaded ? (
				props.weaponInventory.length !== 0 ? (
					<div>
						<Item
							weaponInventory={props.weaponInventory}
							weaponStats={props.weaponStats}
							weapon={weapon}
							hasLoaded={hasLoaded}
						/>
						<Transfer
							setInventoryRows={setInventoryRows}
							inventoryRows={inventoryRows}
							transferItems={transferItems}
							setTransferItems={updateTransferItems}
							weaponInventory={props.weaponInventory}
							weaponStats={props.weaponStats}
							setWeaponStats={props.setWeaponStats}
							fetchWeaponStats={props.fetchWeaponStats}
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
