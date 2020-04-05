import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({ isAuth, setIsAuth }) => {
	const LogOut = (e) => {
		setIsAuth(false);
	};
	return isAuth ? (
		<nav>
			<ul>
				<li>
					<Link to="/">Home</Link>
				</li>
				<li>
					<Link to="/items">Items</Link>
				</li>
				<li>
					<Link to="/login" onClick={(e) => LogOut(e)}>
						Log Out
					</Link>
				</li>
			</ul>
		</nav>
	) : (
		<nav>
			<ul>
				<li>
					<Link to="/register">Register</Link>
				</li>
				<li>
					<Link to="/login">Log In</Link>
				</li>
			</ul>
		</nav>
	);
};

export default Navbar;
