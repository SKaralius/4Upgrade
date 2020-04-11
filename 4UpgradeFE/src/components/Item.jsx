import React from "react";

const Item = (props) => {
	if (props.hasLoaded && props.weaponStats.stats) {
		return (
			<div className="item-container">
				<div className="item-img">
					<img className="weapon" src={props.weapon.imgurl} alt="" />
				</div>
				<div className="item-text">
					<h1>{`${props.weapon.name}`}</h1>
					<ul>
						{props.weaponStats.stats.map((stat) => {
							return (
								<li
									className={stat.type}
									key={stat.weapon_stat_uid}
								>
									{`Adds from ${stat.damage.minDamage} to ${stat.damage.maxDamage} ${stat.type} damage`}
								</li>
							);
						})}
					</ul>
					<h4>{`Total damage: from ${props.weaponStats.totalDamage.minTotalDamage} to ${props.weaponStats.totalDamage.maxTotalDamage} `}</h4>
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
