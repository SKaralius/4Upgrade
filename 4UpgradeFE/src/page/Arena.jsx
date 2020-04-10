import React, { useEffect, useState } from "react";
import http from "../services/httpService";
const Arena = () => {
	const [health, setHealth] = useState(1);
	const [encounter, setEncounter] = useState(true);
	const token = localStorage.getItem("token");
	useEffect(() => {
		console.log("in use effect");
		const fetchData = async () => {
			const { data } = await http.get(
				process.env.REACT_APP_IP + "combat/getenemy",
				{
					headers: {
						Authorization: "Bearer " + token, //the token is a variable which holds the token
					},
				}
			);
			console.log("in fetch data", data.health);
			setHealth(data.health);
			setEncounter(true);
		};
		fetchData();
	}, []);
	const handleDealDamage = async () => {
		console.log(token);
		const { data } = await http.patch(
			process.env.REACT_APP_IP + "combat/dealdamage",
			{},
			{
				headers: {
					Authorization: "Bearer " + token, //the token is a variable which holds the token
				},
			}
		);
		console.log(data.health);
		if (data.health < 1) {
			setHealth(data.health);
			setEncounter(false);
			http.delete(process.env.REACT_APP_IP + "combat/endencounter", {
				headers: {
					Authorization: "Bearer " + token, //the token is a variable which holds the token
				},
			});
		}
		setHealth(data.health);
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
			<button onClick={(event) => handleClick(event)}>Get Item</button>
			{encounter ? (
				<React.Fragment>
					<h1>{health}</h1>
					<button onClick={handleDealDamage}>ATTACK</button>
				</React.Fragment>
			) : (
				<h1>The monster is dead</h1>
			)}
		</div>
	);
};

export default Arena;
