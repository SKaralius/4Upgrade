import React from "react";

const animations = ["hitLeft", "hitRight", "hitUp"];

const Battle = ({ buttonDisabled, handleDealDamage, monster }) => {
	return (
		<div className="monster">
			<div
				className={`damage ${
					buttonDisabled ? "damageAnimation" : "damageHidden"
				}`}
				style={{
					transform: `rotate(${
						Math.ceil(Math.random() * 90) - 45
					}deg)`,
				}}
			>{`${monster.lastDamageDealt || "???"}`}</div>
			<div
				className={`healthContainer ${
					buttonDisabled
						? animations[Math.floor(Math.random() * 3)]
						: "idle"
				}`}
			>
				<div className="maxHealth">
					<div
						className="currentHealth"
						style={{
							width: `${
								monster.currentHealth /
								(monster.maxHealth / 100)
							}%`,
							height: `${
								monster.currentHealth /
								(monster.maxHealth / 100)
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
