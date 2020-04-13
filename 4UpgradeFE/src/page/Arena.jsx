import React, { useEffect, useState } from "react";
import http from "../services/httpService";
import attack from "../img/attack.png";

const animations = ["hitLeft", "hitRight", "hitUp"];

const Arena = ({ weaponInventory, token }) => {
	const [monster, setMonster] = useState([]);
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
		<div className="encounterContainer">
			{encounter ? (
				<div className="monster">
					<div
						className={`damage ${
							buttonDisabled ? "damageAnimation" : "damageHidden"
						}`}
						style={{
							transform: `rotate(${
								Math.ceil(Math.random() * 90) - 45
							}deg)`,
						}}
					>{`${monster.lastDamageDealt}`}</div>
					<div
						className={`healthContainer ${
							buttonDisabled
								? animations[Math.floor(Math.random() * 3)]
								: "idle"
						}`}
					>
						<div className="maxHealth">
							<div
								className="currentHealth"
								style={{
									width: `${
										monster.currentHealth /
										(monster.maxHealth / 100)
									}%`,
									height: `${
										monster.currentHealth /
										(monster.maxHealth / 100)
									}%`,
								}}
							></div>
						</div>
					</div>

					<button
						className="attackButton"
						onClick={handleDealDamage}
						disabled={buttonDisabled}
					>
						<img src={attack} alt="attack" />
					</button>
				</div>
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
