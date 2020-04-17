import React, { useEffect, useState, useCallback } from "react";

import Inventory from "../components/Inventory";
import Item from "../components/Item";
import Transfer from "../components/Transfer";

const Items = ({
	weaponsDetails,
	updateWeaponsDetails,
	selectedWeapon,
	setSelectedWeapon,
	weaponStats,
	updateWeaponStats,
	token,
}) => {
	const [transferItems, setTransferItems] = useState([]);
	const [inventoryRows, setInventoryRows] = useState([]);
	const updateTransferItems = (newItems) => {
		if (newItems.length > 2) {
			return false;
		} else {
			setTransferItems(newItems);
			return true;
		}
	};
	const updateInventoryRows = useCallback((newRows) => {
		return setInventoryRows(newRows);
	}, []);
	return (
		<React.Fragment>
			{selectedWeapon.weapon_entry_uid ? (
				<div>
					<Item
						weaponStats={weaponStats}
						selectedWeapon={selectedWeapon}
					/>
					<Transfer
						updateInventoryRows={updateInventoryRows}
						inventoryRows={inventoryRows}
						transferItems={transferItems}
						updateTransferItems={updateTransferItems}
						selectedWeapon={selectedWeapon}
						updateWeaponStats={updateWeaponStats}
						token={token}
					/>
				</div>
			) : (
				<h1>You don't have a weapon</h1>
			)}
			<Inventory
				inventoryRows={inventoryRows}
				updateInventoryRows={updateInventoryRows}
				transferItems={transferItems}
				updateTransferItems={updateTransferItems}
				inventorySize={24}
				token={token}
				// WeaponInventory
				weaponsDetails={weaponsDetails}
				updateWeaponsDetails={updateWeaponsDetails}
				setSelectedWeapon={setSelectedWeapon}
			/>
		</React.Fragment>
	);
};

export default Items;
