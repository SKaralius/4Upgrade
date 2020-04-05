import React from "react";

const InventoryItems = (props) => {
	const rows = [];
	let key = 0;
	const getKey = () => {
		return key++;
	};
	const handleClick = (event) => {
		const items = props.inventory;
		let itemObject = items.filter(
			(item) => item.item_uid === event.target.id
		);

		props.setInventory([...items]);
		const modifiedItemObject = { ...itemObject[0] };
		modifiedItemObject.quantity = 1;
		const isUpdated = props.setTransferItems([
			...props.transferItems,
			modifiedItemObject,
		]);
		if (isUpdated) {
			itemObject[0].quantity -= 1;
		} else {
			console.log("Cannot move item");
		}
	};
	props.inventory.map((item) => {
		for (let i = 0; i < item.quantity; i++) {
			rows.push(
				<span key={item.item_uid + i + getKey()}>
					<span>
						<button onClick={(event) => handleClick(event)}>
							<img
								src={item.imgurl}
								alt={item.name}
								id={item.item_uid}
							/>
						</button>
					</span>
				</span>
			);
		}
	});
	const freeSpace = props.inventorySize - rows.length;
	for (let b = 0; b < freeSpace; b++) {
		rows.push(
			<span key={b}>
				<span></span>
			</span>
		);
	}
	return <div className="inventory">{rows}</div>;
};

export default InventoryItems;
