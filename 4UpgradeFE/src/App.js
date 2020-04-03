import React from "react";
import { Switch, Route } from "react-router-dom";

import Navbar from "./common/Navbar";
import Items from "./page/Items";
import Register from "./page/Register";
import LogIn from "./page/LogIn";

function App() {
	return (
		<React.Fragment>
			<Navbar />
			<hr />
			<Switch>
				<Route path="/items">
					<Items />
				</Route>
				<Route path="/register">
					<Register />
				</Route>
				<Route path="/login">
					<LogIn />
				</Route>
			</Switch>
		</React.Fragment>
	);
}

export default App;
