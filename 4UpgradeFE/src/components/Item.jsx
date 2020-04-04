import React, { useEffect, useState } from "react";
import http from "../services/httpService";

const Item = (props) => {
	const [hasLoaded, setHasLoaded] = useState(false);
	if (props.hasLoaded) {
		return (
			<div className="item-container">
				<div className="item-img">
					<img className="weapon" src={props.weapon.imgurl} alt="" />
				</div>
				<div className="item-text">
					<h1>{`${props.weapon.name} +${props.weapon.weapon_level}`}</h1>
					<ul>
						{props.weaponStats.map((stat) => (
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
