import React from "react";
import http from "../services/httpService";

const Transfer = (props) => {
	let rows = [];
	let key = 0;
	const token = localStorage.getItem("token");
	const getKey = () => {
		return key++;
	};
	const handleClick = (event) => {
		console.log("Item Removed", event.target.id);
	};
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

	if (props.transferItems.length === 0) {
		return (
			<div className="transfer-container">
				<div className="transfer">
					<span></span>
					<span></span>
					<span></span>
				</div>
				<form onSubmit={handleSubmit}>
					<button type="submit" disabled className="disabled">
						UPGRADE!
					</button>
				</form>
			</div>
		);
	} else {
		props.transferItems.map((item) => {
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
		const freeSpace = 3 - rows.length;
		for (let b = 0; b < freeSpace; b++) {
			rows.push(
				<span key={b}>
					<span></span>
				</span>
			);
		}
		return (
			<div className="transfer-container">
				<div className="transfer">{rows}</div>
				<form onSubmit={handleSubmit}>
					<button type="submit">UPGRADE!</button>
				</form>
			</div>
		);
	}
};

export default Transfer;
