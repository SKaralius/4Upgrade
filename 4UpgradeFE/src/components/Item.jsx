import React, { useEffect, useState } from "react";
import axios from "axios";

const Item = () => {
	const [weapons, setWeapons] = useState([]);
	const [hasLoaded, setHasLoaded] = useState(false);
	useEffect(() => {
		async function fetchData() {
			const { data } = await axios.get(
				"http://localhost:8080/weapons/getWeapons"
			);
			return data;
		}
		fetchData().then(result => {
			setWeapons(result.weapons);
			setHasLoaded(true);
		});
	}, []);
	if (hasLoaded) {
		return (
			<div className="item-container">
				<div className="item-img">
					<img className="weapon" src={weapons[0].imgUrl} alt="" />
				</div>
				<div className="item-text">
					<h1>{weapons[0].name}</h1>
					<ul>
						{weapons[0].weaponStats.map(stat => (
							<li className={stat.textColor} key={stat._id}>
								{stat.desc}
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
