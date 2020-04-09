import React from "react";
import http from "../services/httpService";

const Transfer = (props) => {
	const token = localStorage.getItem("token");
	const createSlots = () => {
		const difference = 3 - props.transferItems.length;
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
		props.transferItems.map((item, index) => {
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
		const inventoryRowCopy = [...props.inventoryRows];
		inventoryRowCopy[item.id] = item;
		const transferItemCopy = [...props.transferItems];
		const notTheItem = transferItemCopy.filter((row) => row.id !== item.id);
		props.setTransferItems(notTheItem);
		props.setInventoryRows(inventoryRowCopy);
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		const upgradeItems = [];
		props.transferItems.map((item) => {
			upgradeItems.unshift(item.item_uid.substring(0, 36));
		});
		const response = await http.post(
			process.env.REACT_APP_IP + "upgrade/postUpgrade",
			{
				id: props.weaponInventory[0].weapon_uid,
				items: upgradeItems,
			},
			{
				headers: {
					Authorization: "Bearer " + token, //the token is a variable which holds the token
				},
			}
		);
		if (response.data === true) {
			props.setWeaponStats(
				await props.fetchWeaponStats(
					props.weaponInventory[0].weapon_uid
				)
			);
			props.setTransferItems([]);
		} else {
			alert(response.data);
		}
	};
	return (
		<div className="transfer-container">
			<div className="transfer">{createSlots()}</div>
			{props.transferItems.length === 0 ? (
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
