import React, { useEffect, useState } from "react";
import http from "../services/httpService";

import InventoryItem from "./InventoryItem";
import WeaponInventory from "../components/WeaponInventory";
import Spinner from "../common/Spinner";

const Inventory = ({
	inventoryRows,
	updateInventoryRows,
	transferItems,
	updateTransferItems,
	inventorySize,
	token,
	weaponsDetails,
	updateWeaponsDetails,
	updateSelectedWeapon,
}) => {
	const [isLoading, setLoading] = useState(false);
	useEffect(() => {
		let isMounted = true;
		const fetchData = async () => {
			setLoading(true);
			let placeholder = [];
			const resourceInventory = await http.get(
				process.env.REACT_APP_IP + "inventory/getresourceinventory",
				{
					headers: {
						Authorization: "Bearer " + token,
					},
				}
			);
			const unresolvedPromises = await resourceInventory.data.map(
				async (inventoryItem) => {
					const itemResult = await http.get(
						process.env.REACT_APP_IP +
							"inventory/getresource/" +
							inventoryItem.item_uid,
						{
							headers: {
								Authorization: "Bearer " + token,
							},
						}
					);
					const itemData = itemResult.data;
					const quantity = inventoryItem.quantity;
					return { ...itemData, quantity };
				}
			);
			const resolvedPromises = await Promise.all(unresolvedPromises);
			resolvedPromises.forEach((itemBundle) => {
				const { item_uid, tier, imgurl, quantity } = itemBundle;
				for (let index = 0; index < quantity; index++) {
					placeholder.push({
						item_uid: item_uid + index,
						tier,
						imgurl,
					});
				}
			});
			const freeSpace = inventorySize - placeholder.length;
			for (let b = 0; b < freeSpace; b++) {
				placeholder.push({
					item_uid: NaN,
					tier: NaN,
					imgurl: null,
				});
			}
			if (isMounted) {
				updateInventoryRows(placeholder);
				setLoading(false);
			}
		};
		if (token) {
			fetchData();
		}
		return () => (isMounted = false);
	}, [token, inventorySize, updateInventoryRows]);
	const handleDeleteItem = (index) => {
		const rowCopy = [...inventoryRows];
		rowCopy[index].id = index;
		http.delete(process.env.REACT_APP_IP + "inventory/deleteitemfromuser", {
			data: {
				item_uid: rowCopy[index].item_uid.substring(0, 36),
			},
			headers: {
				Authorization: "Bearer " + token,
			},
		});
		rowCopy[index] = {};
		updateInventoryRows(rowCopy);
	};
	const handleClick = (index) => {
		const rowCopy = [...inventoryRows];
		rowCopy[index].id = index;
		const wasUpdated = updateTransferItems([
			rowCopy[index],
			...transferItems,
		]);
		if (wasUpdated) {
			rowCopy[index] = {};
			updateInventoryRows(rowCopy);
		}
	};
	return (
		<React.Fragment>
			<hr />
			<WeaponInventory
				weaponsDetails={weaponsDetails}
				updateWeaponsDetails={updateWeaponsDetails}
				handleDeleteItem={handleDeleteItem}
				updateSelectedWeapon={updateSelectedWeapon}
				inventorySize={4}
				token={token}
			/>
			<hr />
			{isLoading ? (
				<Spinner />
			) : (
				<div className="inventory">
					<ul>
						{inventoryRows.map((row, index) => {
							return (
								<InventoryItem
									key={index}
									name={row.name}
									imgurl={row.imgurl}
									item_uid={row.item_uid}
									index={index}
									handleDeleteItem={handleDeleteItem}
									handleClick={handleClick}
								/>
							);
						})}
					</ul>
				</div>
			)}
		</React.Fragment>
	);
};

export default Inventory;
