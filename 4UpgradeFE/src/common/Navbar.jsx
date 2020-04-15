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
					<Link to="/items">Items</Link>
				</li>
				<li>
					<Link to="/arena">Arena</Link>
				</li>
				<li>
					<Link to="/authenticate" onClick={(e) => LogOut(e)}>
						Log Out
					</Link>
				</li>
			</ul>
		</nav>
	) : null;
};

export default Navbar;
