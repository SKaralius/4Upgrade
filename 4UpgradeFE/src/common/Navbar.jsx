import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({ isAuth }) => {
	return isAuth ? (
		<nav>
			<ul>
				<li>
					<Link to="/items">Items</Link>
				</li>
				<li>
					<Link to="/arena">Arena</Link>
				</li>
			</ul>
		</nav>
	) : null;
};

export default Navbar;
