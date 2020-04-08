import React from "react";
import http from "../services/httpService";

const Arena = () => {
	const token = localStorage.getItem("token");
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

			alert(`Congragulations, you got ${data.name}`);
		}
	};
	return <button onClick={(event) => handleClick(event)}>Get Item</button>;
};

export default Arena;
