import React, { useState, useEffect } from "react";
import { getItem } from "../services/fakeItemService";
import axios from "axios";

function formInventory(inventory) {
	let rows = [];
	inventory.forEach(item => {
		for (let i = 0; i < item.qty; i++) {
			rows.push(
				<span key={Math.random()}>
					<span>
						<img src={getItem(item._id).url} alt="" />
					</span>
				</span>
			);
		}
	});
	return rows;
}

function Inventory() {
	const [inventory, setInventory] = useState([]);
	const [rows, setRows] = useState([]);
	useEffect(() => {
		async function fetchData() {
			const data = await axios.get(
				"http://localhost:8080/resources/getresources"
			);
			setInventory(data.data.resources);
		}
		fetchData();
	}, []);

	useEffect(() => {
		setRows(formInventory(inventory));
	}, [inventory]);
	return <div className="inventory">{rows}</div>;
}

export default Inventory;
