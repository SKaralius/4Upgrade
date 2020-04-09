import React from "react";

const Item = (props) => {
	let totalDamage = [0, 0];
	function renderList() {}
	if (props.hasLoaded) {
		return (
			<div className="item-container">
				<div className="item-img">
					<img className="weapon" src={props.weapon.imgurl} alt="" />
				</div>
				<div className="item-text">
					<h1>{`${props.weapon.name}`}</h1>
					<ul>
						{props.weaponStats.map((stat) => {
							totalDamage[0] += stat.damage[0];
							totalDamage[1] += stat.damage[1];
							return (
								<li
									className={stat.type}
									key={stat.weapon_stat_uid}
								>
									{`Adds from ${stat.damage[0]} to ${stat.damage[1]} ${stat.type} damage`}
								</li>
							);
						})}
					</ul>
					<h4>{`Total damage: from ${totalDamage[0]} to ${totalDamage[1]} `}</h4>
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
