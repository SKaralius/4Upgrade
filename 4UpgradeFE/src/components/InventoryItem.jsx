import React from "react";

const InventoryItem = (props) => {
	const rows = [];
	props.inventory.map((item) => {
		for (let i = 0; i < item.quantity; i++) {
			rows.push(
				<span key={item.item_uid + Math.random()}>
					<span>
						<img src={item.imgurl} alt={item.name} />
					</span>
				</span>
			);
		}
	});
	return <div className="inventory">{rows}</div>;
};

export default InventoryItem;
