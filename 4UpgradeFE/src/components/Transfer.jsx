import React, { useState } from "react";
import http from "../services/httpService";

const Transfer = ({
	updateMessageInfo,
	updateWeaponStats,
	transferItems,
	selectedWeapon,
	updateTransferItems,
	inventoryRows,
	updateInventoryRows,
	token,
}) => {
	const [buttonDisabled, setButtonDisabled] = useState(false);
	const createSlots = () => {
		const difference = 2 - transferItems.length;
		let rows = [];
		for (let i = 0; i < difference; i++) {
			rows.push(
				<span key={i}>
					<button></button>
				</span>
			);
		}
		transferItems.forEach((item, index) => {
			rows.unshift(
				<span key={item.item_uid + index}>
					<button onClick={() => handleClick(item)}>
						<img
							src={item.imgurl}
							alt={item.name}
							id={item.item_uid}
						/>
					</button>
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
		setButtonDisabled(true);
		const upgradeItems = [];

		transferItems.forEach((item) => {
			upgradeItems.unshift(item.item_uid.substring(0, 36));
		});
		const response = await http.post(
			process.env.REACT_APP_IP + "upgrade/postUpgrade",
			{
				id: selectedWeapon.weapon_entry_uid,
				items: upgradeItems,
			},
			{
				headers: {
					Authorization: "Bearer " + token,
				},
			}
		);
		if (response.data.success === true) {
			const weaponStatsResult = await http.get(
				process.env.REACT_APP_IP +
					"weapons/getWeaponStats/" +
					selectedWeapon.weapon_entry_uid,
				{
					headers: {
						Authorization: "Bearer " + token,
					},
				}
			);
			updateWeaponStats(weaponStatsResult.data);
			updateMessageInfo({
				message: response.data.message,
				success: true,
			});
			updateTransferItems([]);
		} else {
			updateMessageInfo({
				message: response.data.message,
				success: false,
			});
		}
		setButtonDisabled(false);
	};
	return (
		<React.Fragment>
			<hr />
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
						<button type="submit" disabled={buttonDisabled}>
							UPGRADE!
						</button>
					</form>
				)}
			</div>
		</React.Fragment>
	);
};

export default Transfer;
