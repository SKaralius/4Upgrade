import React, { useEffect, useState } from "react";
import http from "../services/httpService";

const Arena = ({ weaponInventory, token }) => {
	const [monster, setMonster] = useState(1);
	const [encounter, setEncounter] = useState(true);
	const [buttonDisabled, setButtonDisabled] = useState(false);
	useEffect(() => {
		const fetchData = async () => {
			if (weaponInventory.length > 0) {
				const { data } = await http.get(
					process.env.REACT_APP_IP +
						"combat/getenemy/" +
						weaponInventory[0].weapon_uid,
					{
						headers: {
							Authorization: "Bearer " + token, //the token is a variable which holds the token
						},
					}
				);
				setEncounter(true);
				setMonster(data);
			}
		};
		fetchData();
	}, [token, weaponInventory]);
	const handleDealDamage = async () => {
		setButtonDisabled(true);
		setTimeout(() => setButtonDisabled(false), 1000);
		const { data } = await http.patch(
			process.env.REACT_APP_IP + "combat/dealdamage",
			{},
			{
				headers: {
					Authorization: "Bearer " + token, //the token is a variable which holds the token
				},
			}
		);
		if (data.currentHealth < 1) {
			setMonster(data);
			setEncounter(false);
			http.delete(process.env.REACT_APP_IP + "combat/endencounter", {
				data: {
					weapon_uid: weaponInventory[0].weapon_uid,
				},

				headers: {
					Authorization: "Bearer " + token, //the token is a variable which holds the token
				},
			});
		}
		setMonster(data);
	};
	const handleClick = async (event) => {
		event.preventDefault();
		const response = await http.post(
			process.env.REACT_APP_IP + "inventory/addItemToUser",
			{},
			{
				headers: {
					Authorization: "Bearer " + token, //the token is a variable which holds the token
				},
			}
		);
		if (!response.data) {
			return alert("Your inventory is full");
		} else {
			const { data } = await http.get(
				process.env.REACT_APP_IP +
					"inventory/getresource/" +
					response.data,
				{
					headers: {
						Authorization: "Bearer " + token, //the token is a variable which holds the token
					},
				}
			);

			console.log(`Congragulations, you got ${data.name}`);
		}
	};
	return (
		<div>
			{encounter ? (
				<React.Fragment>
					<h1>{monster.currentHealth}</h1>
					<div
						className="healthContainer maxHealth"
						style={{
							display: "flex",
							justifyContent: "center",
						}}
					>
						<div
							className="maxHealth"
							style={{
								width: `50rem`,
								height: "10vw",
								backgroundColor: "#8B0000",
								color: "blue",
								border: "5px inset #8B0000",
							}}
						>
							<div
								style={{
									width: `${
										monster.currentHealth /
										(monster.maxHealth / 100)
									}%`,
									height: "10vw",
									backgroundColor: "red",
									color: "blue",
								}}
								className="health"
							></div>
						</div>
					</div>
					<button
						onClick={handleDealDamage}
						disabled={buttonDisabled}
					>
						ATTACK
					</button>
				</React.Fragment>
			) : (
				<div>
					<h1>The monster is dead</h1>
					<button onClick={(event) => handleClick(event)}>
						Get Item
					</button>
				</div>
			)}
		</div>
	);
};

export default Arena;
