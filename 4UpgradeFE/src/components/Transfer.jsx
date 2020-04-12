import React from "react";
import http from "../services/httpService";

const Transfer = ({
	weaponInventory,
	updateWeaponStats,
	transferItems,
	updateTransferItems,
	inventoryRows,
	updateInventoryRows,
	token,
}) => {
	const createSlots = () => {
		const difference = 2 - transferItems.length;
		let rows = [];
		for (let i = 0; i < difference; i++) {
			rows.push(
				<span key={i}>
					<span>
						<button></button>
					</span>
				</span>
			);
		}
		transferItems.forEach((item, index) => {
			rows.unshift(
				<span key={item.item_uid + index}>
					<span>
						<button onClick={() => handleClick(item)}>
							<img
								src={item.imgurl}
								alt={item.name}
								id={item.item_uid}
							/>
						</button>
					</span>
				</span>
			);
		});
		return rows;
	};
	const handleClick = (item) => {
		const inventoryRowCopy = [...inventoryRows];
		inventoryRowCopy[item.id] = item;
		const transferItemCopy = [...transferItems];
		const notTheItem = transferItemCopy.filter((row) => row.id !== item.id);
		updateTransferItems(notTheItem);
		updateInventoryRows(inventoryRowCopy);
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		const upgradeItems = [];

		transferItems.forEach((item) => {
			upgradeItems.unshift(item.item_uid.substring(0, 36));
		});
		const response = await http.post(
			process.env.REACT_APP_IP + "upgrade/postUpgrade",
			{
				id: weaponInventory[0].weapon_uid,
				items: upgradeItems,
			},
			{
				headers: {
					Authorization: "Bearer " + token, //the token is a variable which holds the token
				},
			}
		);
		if (response.data === true) {
			const weaponStatsResult = await http.get(
				process.env.REACT_APP_IP +
					"weapons/getWeaponStats/" +
					weaponInventory[0].weapon_uid,
				{
					headers: {
						Authorization: "Bearer " + token, //the token is a variable which holds the token
					},
				}
			);
			updateWeaponStats(weaponStatsResult.data);
			updateTransferItems([]);
		} else {
			alert(response.data);
		}
	};
	return (
		<div className="transfer-container">
			<div className="transfer">{createSlots()}</div>
			{transferItems.length === 0 ? (
				<form>
					<button className="disabled" disabled>
						UPGRADE!
					</button>
				</form>
			) : (
				<form onSubmit={handleSubmit}>
					<button type="submit">UPGRADE!</button>
				</form>
			)}
		</div>
	);
};

export default Transfer;
