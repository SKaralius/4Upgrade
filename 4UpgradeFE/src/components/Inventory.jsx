import React, { useState, useEffect } from "react";
import http from "../services/httpService";
import InventoryItem from "./InventoryItem";

const Inventory = () => {
	const token = localStorage.getItem("token");
	const [inventory, setInventory] = useState([]);

	const [hasLoaded, setHasLoaded] = useState(false);
	const getItemData = async (item_uid) => {
		const { data } = await http.get(
			"http://localhost:8080/inventory/getresource/" + item_uid,
			{
				headers: {
					Authorization: "Bearer " + token, //the token is a variable which holds the token
				},
			}
		);
		return data;
	};
	const addToInventory = async (item_uid, quantity) => {
		const itemdata = await getItemData(item_uid);
		return { ...itemdata, quantity };
	};
	useEffect(() => {
		const fetchData = async () => {
			const resourceInventory = await http.get(
				"http://localhost:8080/inventory/getresourceinventory",
				{
					headers: {
						Authorization: "Bearer " + token, //the token is a variable which holds the token
					},
				}
			);
			let unresolvedPromises = await resourceInventory.data.map(
				(inventoryItem) => {
					return addToInventory(
						inventoryItem.item_uid,
						inventoryItem.quantity
					);
				}
			);
			const resolvedPromises = await Promise.all(unresolvedPromises);
			setInventory(resolvedPromises);
			setHasLoaded(true);
		};
		fetchData();
	}, []);
	if (hasLoaded && inventory.length !== 0) {
		return <InventoryItem inventory={inventory} />;
	} else if (inventory.length < 1) {
		return <h1>No items in inventory</h1>;
	} else {
		return <h1>Loading...</h1>;
	}
};

export default Inventory;
