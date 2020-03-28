import React, { useEffect, useState } from "react";
import { getWeapons, getStat } from "../services/fakeUserService";

const Item = () => {
	const [weapons, setWeapons] = useState([]);
	const [hasLoaded, setHasLoaded] = useState(false);
	useEffect(() => {
		function getWeap() {
			const weapons = getWeapons();
			setWeapons(weapons);
			setHasLoaded(true);
		}
		getWeap();
	});
	if (hasLoaded) {
		return (
			<div className="item-container">
				<div className="item-img">
					<img className="weapon" src={weapons[0].url} alt="" />
				</div>
				<div className="item-text">
					<h1>{weapons[0].name}</h1>
					<ul>
						{weapons[0].stats.map(stat => (
							<li className={getStat(stat).textColor}>
								{getStat(stat).desc}
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
