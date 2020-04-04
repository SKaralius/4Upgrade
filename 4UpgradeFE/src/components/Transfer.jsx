import React, { useState } from "react";
import handleChange from "../util/handleChange";
import http from "../services/httpService";

const Transfer = (props) => {
	const token = localStorage.getItem("token");
	const handleSubmit = async (event) => {
		event.preventDefault();
		const { data } = await http.post(
			"http://localhost:8080/weapons/addWeaponStat/",
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
