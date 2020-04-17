import React from "react";

const InventoryItem = ({
	name,
	imgurl,
	item_uid,
	index,
	handleDeleteItem,
	handleClick,
	style,
}) => {
	if (!imgurl) {
		return (
			<li className="itemEntry">
				<span></span>
			</li>
		);
	}
	return (
		<li key={item_uid} className="itemEntry">
			<span>
				<div className="delete">
					<button onClick={() => handleDeleteItem(index)}>X</button>
				</div>
				<button onClick={() => handleClick(index)}>
					<img src={imgurl} alt={name} id={item_uid} style={style} />
				</button>
			</span>
		</li>
	);
};

export default InventoryItem;
