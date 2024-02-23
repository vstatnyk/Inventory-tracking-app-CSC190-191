import { useEffect, useState } from "react";
import FilterMenu from "../components/FilterMenu";
import InventoryList from "../components/InventoryList";
import Nav from "../components/Nav";
import { CheckLoginStatus } from "../functions/CheckLoginStatus";
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

  const handleFilterSubmit = (criteria) => {
    setFilterCriteria(criteria);
  };

  return (
    <>
      {CheckLoginStatus() === true ? (
        <>
          <Nav active="inventory" />
          <FilterMenu onFilterSubmit={handleFilterSubmit} />
          <InventoryList classname="InventoryList" items={items} />
        </>
      ) : (
        <></> // CheckLoginStatus() false
      )}
    </>
  );
}
