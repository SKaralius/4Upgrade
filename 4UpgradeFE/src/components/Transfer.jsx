import React from "react";
import http from "../services/httpService";

const Transfer = (props) => {
	const token = localStorage.getItem("token");
	const handleSubmit = async (event) => {
		event.preventDefault();
		await http.post(
			"http://192.168.1.141:8080/weapons/addWeaponStat/",
			{
				id: props.weaponInventory[0].weapon_uid,
			},
			{
				headers: {
					Authorization: "Bearer " + token, //the token is a variable which holds the token
				},
			}
		);
		props.setWeaponStats(
			await props.fetchWeaponStats(props.weaponInventory[0].weapon_uid)
		);
	};
	return (
		<div className="transfer-container">
			<div className="transfer">
				<span></span>
				<span></span>
				<span></span>
			</div>
			<form onSubmit={handleSubmit}>
				<button type="submit">UPGRADE!</button>
			</form>
		</div>
	);
};

export default Transfer;
