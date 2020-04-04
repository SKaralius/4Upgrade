import React, { useEffect, useState } from "react";
import http from "../services/httpService";

const Item = () => {
	const [weapon, setWeapon] = useState([]);
	const [weaponStats, setWeaponStats] = useState([]);
	const [hasLoaded, setHasLoaded] = useState(false);
	const token = localStorage.getItem("token");
	const fetchWeaponStats = async (weapon_uid) => {
		const { data } = await http.get(
			"http://localhost:8080/weapons/getWeaponStats/" + weapon_uid,
			{
				headers: {
					Authorization: "Bearer " + token, //the token is a variable which holds the token
				},
			}
		);
		return data;
	};
	const fetchWeaponInventory = async () => {
		const { data } = await http.get(
			"http://localhost:8080/inventory/getweaponInventory/",
			{
				headers: {
					Authorization: "Bearer " + token, //the token is a variable which holds the token
				},
			}
		);
		return data;
	};

	const fetchWeapon = async (weapon_uid) => {
		const { data } = await http.get(
			"http://localhost:8080/weapons/getWeapon/" + weapon_uid,
			{
				headers: {
					Authorization: "Bearer " + token, //the token is a variable which holds the token
				},
			}
		);
		return data[0];
	};

	useEffect(() => {
		async function fetchData() {
			const weaponInventory = await fetchWeaponInventory();
			const weaponData = await fetchWeapon(weaponInventory[0].weapon_uid);
			const weaponStats = await fetchWeaponStats(
				weaponInventory[0].weapon_uid
			);
			setWeapon(weaponData);
			setWeaponStats(weaponStats);
		}
		fetchData().then(() => {
			setHasLoaded(true);
		});
	}, []);
	if (hasLoaded) {
		return (
			<div className="item-container">
				<div className="item-img">
					<img className="weapon" src={weapon.imgurl} alt="" />
				</div>
				<div className="item-text">
					<h1>{`${weapon.name} +${weapon.weapon_level}`}</h1>
					<ul>
						{weaponStats.map((stat) => (
							<li
								className={stat.type}
								key={stat.weapon_stat_uid}
							>
								{`Adds ${stat.tier} ${stat.type} damage`}
							</li>
						))}
					</ul>
				</div>
			</div>
		);
	} else {
		return (
			<div>
				<h1>Loading...</h1>
			</div>
		);
	}
};

export default Item;
