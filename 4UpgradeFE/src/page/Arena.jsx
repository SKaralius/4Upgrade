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
	const [activeAnimation, setActiveAnimation] = useState("idle");
	const animations = ["hitLeft", "hitRight", "hitUp"];
	let buttonTimeout;
	let damageTimeout;
	let animationTimeout;
	useEffect(() => {
		let isMounted = true;
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
				if (isMounted) {
					setEncounter(true);
					setMonster(data);
				}
			}
		};
		fetchData();
		return () => (isMounted = false);
	}, [token, selectedWeapon]);
	const handleDealDamage = async () => {
		setButtonDisabled(true);
		buttonTimeout = setTimeout(() => setButtonDisabled(false), 1000);
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
			setMonster(data);
		} else {
			setMonster(data);
			setActiveAnimation(animations[Math.floor(Math.random() * 3)]);
			animationTimeout = setTimeout(
				() => setActiveAnimation("idle"),
				1000
			);
			const damageElement = document.getElementsByClassName("damage")[0];
			damageElement.className += " damageAnimation";
			damageTimeout = setTimeout(
				() => (damageElement.className = "damage damageHidden"),
				1000
			);
		}
	};
	useEffect(() => {
		return () => {
			clearInterval(buttonTimeout);
			clearInterval(damageTimeout);
			clearInterval(animationTimeout);
		};
	}, [damageTimeout, buttonTimeout, animationTimeout]);
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
				let monsterCopy = monster;
				delete monsterCopy.weapon_entry_uid;
				setMonster(monsterCopy);
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
	}, [
		monster,
		token,
		weaponsDetails,
		updateWeaponsDetails,
		updateMessageInfo,
	]);
	return (
		<div className="encounterContainer">
			{encounter ? (
				<Battle
					buttonDisabled={buttonDisabled}
					monster={monster}
					handleDealDamage={handleDealDamage}
					activeAnimation={activeAnimation}
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
