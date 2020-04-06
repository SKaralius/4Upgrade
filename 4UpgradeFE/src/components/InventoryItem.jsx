import React, { useEffect, useState } from "react";

const InventoryItems = (props) => {
	const handleClick = (item_uid) => {
		let rowCopy = [...props.inventoryRows];
		rowCopy[item_uid].id = item_uid;
		const wasUpdated = props.setTransferItems([
			...props.transferItems,
			rowCopy[item_uid],
		]);
		if (wasUpdated) {
			rowCopy[item_uid] = {};
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
