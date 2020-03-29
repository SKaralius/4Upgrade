import React, { useState, useEffect } from "react";
import { getItem } from "../services/fakeItemService";
import { getInventory } from "../services/fakeUserService";

function formInventory(inventory) {
	let rows = [];
	inventory.forEach(item => {
		for (let i = 0; i < item.qty; i++) {
			rows.push(
				<span key={Math.random()}>
					<span>
						<img src={getItem(item.id).url} alt="" />
					</span>
				</span>
			);
		}
	});
	return rows;
}

function Inventory() {
	const [inventory, setinventory] = useState([]);
	const [rows, setRows] = useState([]);
	useEffect(() => {
		setinventory(getInventory());
		setRows(formInventory(inventory));
	}, [inventory]);
	return <div className="inventory">{rows}</div>;
}

export default Inventory;
