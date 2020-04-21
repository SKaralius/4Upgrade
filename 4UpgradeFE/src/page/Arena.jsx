import React, { useEffect, useState } from "react";
import http from "../services/httpService";
import Battle from "../components/Battle";

const Arena = ({
	selectedWeapon,
	weaponsDetails,
	updateWeaponsDetails,
	updateMessageInfo,
	token,
}) => {
	const [monster, setMonster] = useState([]);
	const [encounter, setEncounter] = useState(true);
	const [buttonDisabled, setButtonDisabled] = useState(false);
	useEffect(() => {
		const fetchData = async () => {
			if (selectedWeapon.weapon_entry_uid) {
				const { data } = await http.get(
					process.env.REACT_APP_IP +
						"combat/getenemy/" +
						selectedWeapon.weapon_entry_uid,
					{
						headers: {
							Authorization: "Bearer " + token,
						},
					}
				);
				setEncounter(true);
				setMonster(data);
			}
		};
		fetchData();
	}, [token, selectedWeapon]);
	const handleDealDamage = async () => {
		setButtonDisabled(true);
		setTimeout(() => setButtonDisabled(false), 1000);
		const { data } = await http.patch(
			process.env.REACT_APP_IP + "combat/dealdamage",
			{},
			{
				headers: {
					Authorization: "Bearer " + token,
				},
			}
		);
		if (data.currentHealth < 1) {
			setMonster(data);
			setEncounter(false);
			http.delete(process.env.REACT_APP_IP + "combat/endencounter", {
				data: {
					weapon_uid: selectedWeapon.weapon_entry_uid,
				},

				headers: {
					Authorization: "Bearer " + token,
				},
			});
		}
		setMonster(data);
	};
	useEffect(() => {
		async function fetchData() {
			if (monster.item_uid) {
				const { data } = await http.get(
					process.env.REACT_APP_IP +
						"inventory/getresource/" +
						monster.item_uid,
					{
						headers: {
							Authorization: "Bearer " + token,
						},
					}
				);
				updateMessageInfo({
					message: `You got ${data.name}`,
					imgurl: data.imgurl,
					success: true,
				});
			} else if (monster.weapon_entry_uid) {
				// Get weapon information
				const weaponDataResult = await http.get(
					process.env.REACT_APP_IP +
						"weapons/getWeapon/" +
						monster.weapon_entry_uid,
					{
						headers: {
							Authorization: "Bearer " + token,
						},
					}
				);
				weaponDataResult.data.weapon_entry_uid =
					monster.weapon_entry_uid;
				// Pass the new weapon to weapon Details
				updateWeaponsDetails([
					...weaponsDetails,
					weaponDataResult.data,
				]);
				updateMessageInfo({
					message: `You got ${weaponDataResult.data.name}`,
					imgurl: weaponDataResult.data.imgurl,
					success: true,
				});
			} else if (monster.error) {
				updateMessageInfo({
					message: monster.error,
					success: false,
				});
			}
		}

		fetchData();
	}, [monster]);
	return (
		<div className="encounterContainer">
			{encounter ? (
				<Battle
					buttonDisabled={buttonDisabled}
					monster={monster}
					handleDealDamage={handleDealDamage}
				/>
			) : (
				<button className="restart" onClick={() => setEncounter(true)}>
					Restart
				</button>
			)}
		</div>
	);
};

export default Arena;
