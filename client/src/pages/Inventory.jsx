import { useEffect, useState } from "react";
import FilterMenu from "../components/FilterMenu";
import InventoryList from "../components/InventoryList";
import Nav from "../components/Nav";
import { getItems } from "../utils/api";

export default function Inventory() {
  const [items, setItems] = useState([]);
  const [filterCriteria, setFilterCriteria] = useState({});

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const items = await getItems(
          filterCriteria.name,
          filterCriteria.description,
          filterCriteria.quantity,
          localStorage.getItem("token")
        );
        setItems(items);
      } catch (error) {
        console.error("Error fetching items:", error.message);
      }
    };

    fetchItems();
  }, [filterCriteria]);

  return (
    <>
      <Nav active="inventory" />
      <InventoryList classname="InventoryList" items={items} />
    </>
  );
}
