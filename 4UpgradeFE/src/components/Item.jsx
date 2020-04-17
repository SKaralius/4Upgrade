import React from "react";

const Item = ({ weaponStats, selectedWeapon }) => {
	return weaponStats.stats && selectedWeapon.weapon_entry_uid ? (
		<div className="item-container">
			<div className="item-img">
				<img className="weapon" src={selectedWeapon.imgurl} alt="" />
			</div>
			<div className="item-text">
				<h1>{`${selectedWeapon.name}`}</h1>
				<ul>
					<li>{`Base Damage: ${weaponStats.weaponInfo.damage.minDamage} to ${weaponStats.weaponInfo.damage.maxDamage}`}</li>
					{weaponStats.stats.map((stat) => {
						return (
							<li
								className={stat.type}
								key={stat.weapon_stat_uid}
							>
								{`Adds ${stat.damage.minDamage} to ${stat.damage.maxDamage} ${stat.type} damage`}
							</li>
						);
					})}
				</ul>
				<h4>{`Total damage: ${weaponStats.totalDamage.minTotalDamage} to ${weaponStats.totalDamage.maxTotalDamage} `}</h4>
			</div>
		</div>
	) : (
		<h1>Loading...</h1>
	);
};

export default Item;
