import React, { useState, useEffect } from "react";

const Spinner = () => {
	const [display, setDisplay] = useState(null);
	useEffect(() => {
		let timeoutVar = setTimeout(() => {
			setDisplay(
				<div className="spinnerContainer">
					<div className="spinner"></div>
				</div>
			);
		}, 100);
		return () => {
			clearTimeout(timeoutVar);
		};
	}, []);
	return display;
};

export default Spinner;
