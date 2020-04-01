import React from "react";
import Inventory from "./components/Inventory";
import Navbar from "./common/Navbar";
import Item from "./components/Item";
import Transfer from "./components/Transfer";

function App() {
	return (
		<div>
			<Navbar />
			<hr />
			<Item />
			<Transfer />
			<hr />
		</div>
	);
}

export default App;
