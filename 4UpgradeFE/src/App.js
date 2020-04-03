import React from "react";
import { Switch, Route, BrowserRouter } from "react-router-dom";

import Navbar from "./common/Navbar";
import Items from "./page/Items";
import Register from "./page/Register";
import LogIn from "./page/LogIn";

function App() {
	return (
		<React.Fragment>
			<BrowserRouter>
				<Navbar />
				<hr />
				<Switch>
					<Route path="/items" component={Items}></Route>
					<Route path="/register" component={Register}></Route>
					<Route path="/login" component={LogIn}></Route>
				</Switch>
			</BrowserRouter>
		</React.Fragment>
	);
}

export default App;
