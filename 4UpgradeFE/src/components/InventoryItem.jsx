import React, { useEffect } from "react";
import http from "../services/httpService";

const InventoryItems = (props) => {
	const token = localStorage.getItem("token");
	const handleDeleteItem = (index) => {
		const rowCopy = [...props.inventoryRows];
		rowCopy[index].id = index;
		http.delete(process.env.REACT_APP_IP + "inventory/deleteitemfromuser", {
			data: {
				item_uid: rowCopy[index].item_uid.substring(0, 36),
			},
			headers: {
				Authorization: "Bearer " + token, //the token is a variable which holds the token
			},
		});
		rowCopy[index] = {};
		props.setInventoryRows(rowCopy);
	};
	const handleClick = (index) => {
		const rowCopy = [...props.inventoryRows];
		rowCopy[index].id = index;
		const wasUpdated = props.setTransferItems([
			rowCopy[index],
			...props.transferItems,
		]);
		if (wasUpdated) {
			rowCopy[index] = {};
			props.setInventoryRows(rowCopy);
		}
	};
	const computeRows = () => {
		let placeholder = [];
		props.inventory.map((itemBundle) => {
			const { item_uid, name, tier, imgurl, quantity } = itemBundle;
			for (let index = 0; index < quantity; index++) {
				placeholder.push({
					item_uid: item_uid + index,
					name,
					tier,
					imgurl,
				});
			}
		});
		const freeSpace = props.inventorySize - placeholder.length;
		for (let b = 0; b < freeSpace; b++) {
			placeholder.push({
				item_uid: b,
				name: false,
				tier: NaN,
				imgurl: null,
			});
		}
		props.setInventoryRows(placeholder);
	};
	useEffect(() => {
		computeRows();
	}, [props.inventory]);
	return (
		<div className="inventory">
			<ul>
				{props.inventoryRows.map((row, index) => {
					if (!row.name) {
						return (
							<li key={index}>
								<span></span>
							</li>
						);
					}
					return (
						<li key={row.item_uid + index}>
							<span>
								<div className="delete">
									<button
										onClick={() => handleDeleteItem(index)}
									>
										X
									</button>
								</div>
								<button onClick={() => handleClick(index)}>
									<img
										src={row.imgurl}
										alt={row.name}
										id={row.item_uid}
									/>
								</button>
							</span>
						</li>
					);
				})}
			</ul>
		</div>
	);
};

export default InventoryItems;
