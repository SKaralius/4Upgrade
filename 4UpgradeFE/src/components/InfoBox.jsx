import React from "react";

const InfoBox = ({ message, imgurl, success, updateMessageInfo }) => {
	const handleClick = () => {
		updateMessageInfo({});
	};
	return (
		<div className="infoBox">
			<h1>{success ? "Success!" : "Oops!"}</h1>
			<h3>{message}</h3>
			<div>
				<div></div>
				{success && imgurl ? (
					<img src={imgurl} alt="item" />
				) : (
					<div></div>
				)}
				<button
					type="submit"
					className="infoBoxSubmit"
					onClick={handleClick}
				>
					Confirm
				</button>
			</div>
		</div>
	);
};

export default InfoBox;
