import React, { useState, useEffect } from "react";
import { Switch, Route } from "react-router-dom";

import Navbar from "./common/Navbar";
import Items from "./page/Items";
import Register from "./page/Register";
import LogIn from "./page/LogIn";
import Arena from "./page/Arena";

function App() {
	const [isAuth, setIsAuth] = useState(false);
	const [token, setToken] = useState("");
	useEffect(() => {});
	return (
		<React.Fragment>
			<Navbar isAuth={isAuth} setIsAuth={setIsAuth} />
			<hr />
			<Switch>
				<Route path="/register" component={Register}></Route>
				<Route path="/arena" component={Arena}></Route>
				<Route path="/items" component={Items}></Route>
				<Route
					path="/login"
					render={(props) => (
						<LogIn
							{...props}
							setIsAuth={setIsAuth}
							token={token}
							setToken={setToken}
						/>
					)}
				/>
			</Switch>
		</React.Fragment>
	);
}

export default App;
