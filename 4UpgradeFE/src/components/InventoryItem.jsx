import React, { useEffect } from "react";
import http from "../services/httpService";

const InventoryItems = ({
	inventory,
	inventoryRows,
	updateInventoryRows,
	inventorySize,
	transferItems,
	updateTransferItems,
	token,
}) => {
	const handleDeleteItem = (index) => {
		const rowCopy = [...inventoryRows];
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
		updateInventoryRows(rowCopy);
	};
	const handleClick = (index) => {
		const rowCopy = [...inventoryRows];
		rowCopy[index].id = index;
		const wasUpdated = updateTransferItems([
			rowCopy[index],
			...transferItems,
		]);
		if (wasUpdated) {
			rowCopy[index] = {};
			updateInventoryRows(rowCopy);
		}
	};
	useEffect(() => {
		let placeholder = [];
		inventory.forEach((itemBundle) => {
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
		const freeSpace = inventorySize - placeholder.length;
		for (let b = 0; b < freeSpace; b++) {
			placeholder.push({
				item_uid: b,
				name: false,
				tier: NaN,
				imgurl: null,
			});
		}
		updateInventoryRows(placeholder);
		// linter suggests including updateInventoryRows in dependencies,
		// but that causes an infinite loop. Update inventory rows cannot be "unpacked" here.
		// Every component must change only it's own state. That's why updateInventoryRows callback
		// is necessary. Also tried to useCallback.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [inventory, inventorySize]);
	return (
		<div className="inventory">
			<ul>
				{inventoryRows.map((row, index) => {
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
