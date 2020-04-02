import React from "react";

import Inventory from "../components/Inventory";
import Item from "../components/Item";
import Transfer from "../components/Transfer";

const Items = () => {
	return (
		<React.Fragment>
			<Item />
			<Transfer />
			<hr />
			{/* <Inventory /> */}
		</React.Fragment>
	);
};

export default Items;
