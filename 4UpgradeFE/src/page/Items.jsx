import React, { useEffect, useState, useCallback } from "react";
import http from "../services/httpService";

import Inventory from "../components/Inventory";
import Item from "../components/Item";
import Transfer from "../components/Transfer";

const Items = ({ weaponInventory, weaponStats, updateWeaponStats, token }) => {
	const [weapon, setWeapon] = useState([]);
	const [transferItems, setTransferItems] = useState([]);
	const [inventoryRows, setInventoryRows] = useState([]);
	useEffect(() => {
		async function fetchData() {
			if (weaponInventory.length > 0) {
				const weaponDataResult = await http.get(
					process.env.REACT_APP_IP +
						"weapons/getWeapon/" +
						weaponInventory[0].weapon_uid,
					{
						headers: {
							Authorization: "Bearer " + token, //the token is a variable which holds the token
						},
					}
				);
				setWeapon(weaponDataResult.data[0]);
			}
		}
		fetchData();
		console.log("tries to retrieve weapon by weapon inventory");
	}, [token, weaponInventory]);
	const updateTransferItems = (newItems) => {
		if (newItems.length > 2) {
			return false;
		} else {
			setTransferItems(newItems);
			return true;
		}
	};
	const updateInventoryRows = useCallback((newRows) => {
		return setInventoryRows(newRows);
	}, []);
	return (
		<React.Fragment>
			{weaponInventory.length !== 0 ? (
				<div>
					<Item weaponStats={weaponStats} weapon={weapon} />
					<Transfer
						updateInventoryRows={updateInventoryRows}
						inventoryRows={inventoryRows}
						transferItems={transferItems}
						updateTransferItems={updateTransferItems}
						weaponInventory={weaponInventory}
						updateWeaponStats={updateWeaponStats}
						token={token}
					/>
				</div>
			) : (
				<h1>You don't have a weapon</h1>
			)}

			<hr />
			<Inventory
				updateInventoryRows={updateInventoryRows}
				inventoryRows={inventoryRows}
				updateTransferItems={updateTransferItems}
				transferItems={transferItems}
				token={token}
			/>
		</React.Fragment>
	);
};

export default Items;
