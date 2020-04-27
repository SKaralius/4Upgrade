import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
	return (
		<div className="notFoundContainer">
			<h1 className="notFound">No such page.</h1>
			<span>
				<Link className="startLink" to="/authenticate">
					<div>Start Here</div>
				</Link>
			</span>
		</div>
	);
};

export default NotFound;
