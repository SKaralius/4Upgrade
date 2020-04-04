import React from "react";

const Transfer = (props) => {
	const handleSubmit = async (event) => {
		event.preventDefault();
	};
	return (
		<div className="transfer-container">
			<div className="transfer">
				<span></span>
				<span></span>
				<span></span>
			</div>
			<form onSubmit={handleSubmit}>
				<input type="hidden" value={5} />
				<button type="submit">UPGRADE!</button>
			</form>
		</div>
	);
};

export default Transfer;
