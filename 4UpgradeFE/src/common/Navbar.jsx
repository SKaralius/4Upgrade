import React from "react";
import { Link } from "react-router-dom";
import http from "../services/httpService";

const Navbar = ({ isAuth, updateAuth }) => {
	const LogOut = (e) => {
		updateAuth(false);
		localStorage.removeItem("token");
		http.delete(process.env.REACT_APP_IP + "users/logout", {
			data: {
				refreshToken: localStorage.getItem("refreshToken"),
			},
		});
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
					<Link to="/arena">Arena</Link>
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
