import React from "react";
import { Link } from "react-router-dom";
import http from "../services/httpService";

const Footer = ({ isAuth, updateAuth }) => {
	const LogOut = (e) => {
		updateAuth(false);
		localStorage.removeItem("token");
		http.delete(process.env.REACT_APP_IP + "users/logout", {
			data: {
				refreshToken: localStorage.getItem("refreshToken"),
			},
		});
	};
	return (
		<footer>
			<ul>
				<li>
					<a
						href="https://github.com/SKaralius/4Upgrade"
						target="_blank"
						rel="noopener noreferrer"
					>
						Github
					</a>
				</li>
				{isAuth ? (
					<li>
						<Link to="/" onClick={(e) => LogOut(e)}>
							Log Out
						</Link>
					</li>
				) : null}
			</ul>
		</footer>
	);
};

export default Footer;
