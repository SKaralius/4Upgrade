import React from "react";
import http from "../services/httpService";

import InventoryItem from "./InventoryItem";
import Spinner from "../common/Spinner";

const WeaponInventory = ({
	weaponsDetails,
	updateWeaponsDetails,
	updateSelectedWeapon,
	inventorySize,
	token,
}) => {
	const handleDeleteItem = (index) => {
		const weaponsDetailsCopy = [...weaponsDetails];
		if (weaponsDetailsCopy.length > 1) {
			http.delete(
				process.env.REACT_APP_IP + "weapons/deleteweaponfromuser",
				{
					data: {
						weapon_entry_uid: weaponsDetailsCopy[
							index
						].weapon_entry_uid.substring(0, 36),
					},
					headers: {
						Authorization: "Bearer " + token,
					},
				}
			);
			const newWeaponDetails = weaponsDetailsCopy.filter(
				(detail, i) => i !== index
			);
			updateSelectedWeapon(newWeaponDetails[0]);
			updateWeaponsDetails(newWeaponDetails);
		} else {
			alert("You cannnot delete your last weapon.");
		}
	};
	const handleClick = (index) => {
		updateSelectedWeapon(weaponsDetails[index]);
	};
	const createSlots = () => {
		const difference = inventorySize - weaponsDetails.length;
		let rows = [];
		for (let i = 0; i < difference; i++) {
			rows.push(
				<li key={i} className="itemEntry">
					<span></span>
				</li>
			);
		}
		weaponsDetails.forEach((weapon, index) => {
			rows.unshift(
				<InventoryItem
					key={weapon.weapon_entry_uid}
					name={weapon.name}
					imgurl={weapon.imgurl}
					item_uid={weapon.weapon_entry_uid}
					index={index}
					handleDeleteItem={handleDeleteItem}
					handleClick={handleClick}
					style={{ height: "69px" }}
				/>
			);
		});
		return rows;
	};

	if (weaponsDetails.length > 0) {
		return (
			<div className="inventory">
				<ul>{createSlots()}</ul>
			</div>
		);
	} else {
		return <Spinner />;
	}
};

export default WeaponInventory;
