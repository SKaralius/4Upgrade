import React, { useState, useCallback } from "react";

import Inventory from "../components/Inventory";
import Item from "../components/Item";
import Transfer from "../components/Transfer";
import Spinner from "../common/Spinner";

const Items = ({
	weaponStatsLoading,
	weaponsDetails,
	updateWeaponsDetails,
	selectedWeapon,
	updateSelectedWeapon,
	updateMessageInfo,
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
					<hr />
					<Item
						weaponStatsLoading={weaponStatsLoading}
						weaponStats={weaponStats}
						selectedWeapon={selectedWeapon}
					/>
					<Transfer
						updateMessageInfo={updateMessageInfo}
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
				<Spinner />
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
				updateSelectedWeapon={updateSelectedWeapon}
				updateMessageInfo={updateMessageInfo}
			/>
		</React.Fragment>
	);
};

export default Items;
