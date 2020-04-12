import React, { useState, useEffect } from "react";
import http from "../services/httpService";
import InventoryItems from "./InventoryItem";

const Inventory = ({
	updateTransferItems,
	transferItems,
	inventoryRows,
	updateInventoryRows,
	token,
}) => {
	const [inventory, setInventory] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			const resourceInventory = await http.get(
				process.env.REACT_APP_IP + "inventory/getresourceinventory",
				{
					headers: {
						Authorization: "Bearer " + token, //the token is a variable which holds the token
					},
				}
			);
			const unresolvedPromises = await resourceInventory.data.map(
				async (inventoryItem) => {
					const itemResult = await http.get(
						process.env.REACT_APP_IP +
							"inventory/getresource/" +
							inventoryItem.item_uid,
						{
							headers: {
								Authorization: "Bearer " + token, //the token is a variable which holds the token
							},
						}
					);
					const itemData = itemResult.data;
					const quantity = inventoryItem.quantity;
					return { ...itemData, quantity };
				}
			);
			const resolvedPromises = await Promise.all(unresolvedPromises);
			updateInventory(resolvedPromises);
		};
		if (token) {
			fetchData();
		}
	}, [token]);
	const updateInventory = (newInventory) => {
		setInventory(newInventory);
	};
	if (inventory.length !== 0) {
		return (
			<InventoryItems
				updateInventoryRows={updateInventoryRows}
				inventoryRows={inventoryRows}
				updateTransferItems={updateTransferItems}
				transferItems={transferItems}
				inventory={inventory}
				inventorySize={24}
				token={token}
			/>
		);
	} else {
		return <h1>Loading...</h1>;
	}
};

export default Inventory;
