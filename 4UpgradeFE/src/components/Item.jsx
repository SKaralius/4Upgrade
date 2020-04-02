import React, { useEffect, useState } from "react";
import axios from "axios";

const Item = () => {
	const [weapon, setWeapon] = useState([]);
	const [weaponStats, setWeaponStats] = useState([]);
	const [hasLoaded, setHasLoaded] = useState(false);
	useEffect(() => {
		async function fetchWeaponData() {
			const { data } = await axios.get(
				"http://localhost:8080/weapons/getWeapon/" +
					"9604ec51-29f5-4b32-95a7-d9b8a84b6c97"
			);
			return data[0];
		}
		async function fetchWeaponStats() {
			const { data } = await axios.get(
				"http://localhost:8080/weapons/getWeaponStats/" +
					"9604ec51-29f5-4b32-95a7-d9b8a84b6c97"
			);
			return data;
		}
		async function fetchData() {
			const weaponData = await fetchWeaponData();
			const weaponStats = await fetchWeaponStats();
			setWeapon(weaponData);
			setWeaponStats(weaponStats);
			console.log(weaponStats);
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
						{weaponStats.map(stat => (
							<li className={stat.type} key={stat.stat_uid}>
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
