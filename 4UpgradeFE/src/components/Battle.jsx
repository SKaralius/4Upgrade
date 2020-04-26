import React from "react";

const Battle = ({
	buttonDisabled,
	handleDealDamage,
	monster,
	activeAnimation,
}) => {
	return (
		<div className="monster">
			<div
				className="damage damageHidden"
				style={{
					transform: `rotate(${
						Math.ceil(Math.random() * 90) - 45
					}deg)`,
				}}
			>{`${monster.lastDamageDealt || "0"}`}</div>
			<div className={`healthContainer ${activeAnimation || "idle"}`}>
				<div className="maxHealth">
					<div
						className="currentHealth"
						style={{
							width: `${
								monster.currentHealth /
									(monster.maxHealth / 100) || 100
							}%`,
							height: `${
								monster.currentHealth /
									(monster.maxHealth / 100) || 100
							}%`,
						}}
					></div>
					<button
						className="attackButton"
						onClick={handleDealDamage}
						disabled={buttonDisabled}
					></button>
				</div>
			</div>
		</div>
	);
};

export default Battle;
