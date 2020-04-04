import React, { useState } from "react";
import { Switch, Route } from "react-router-dom";

import Navbar from "./common/Navbar";
import Items from "./page/Items";
import Register from "./page/Register";
import LogIn from "./page/LogIn";

function App() {
	const [isAuth, setIsAuth] = useState(true);
	const [token, setToken] = useState(null);
	return (
		<React.Fragment>
			<Navbar props={isAuth} />
			<hr />
			<Switch>
				<Route path="/items" component={Items}></Route>
				<Route path="/register" component={Register}></Route>
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
