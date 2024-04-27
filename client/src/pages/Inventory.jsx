import { useEffect, useState } from "react";
import FilterMenu from "../components/FilterMenu";
import InventoryList from "../components/InventoryList";
import Nav from "../components/Nav";
import { getItems, getUser } from "../utils/api";

export default function Inventory() {
  const [items, setItems] = useState([]);
  const [filterCriteria, setFilterCriteria] = useState({});
  const [useraccount, setUseraccount] = useState(null);
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const user = await getUser(localStorage.getItem("token"));
        setUseraccount(user);
        const items = await getItems(
          filterCriteria.name,
          filterCriteria.description,
          filterCriteria.quantity,
          localStorage.getItem("token")
        );
        console.log(items);

        if (user.accessLevel < 4) {
          const allowedItems = [];
          const userDepartments = user.department;
          for (const i in items) {
            const item = items[i];
            const itemDepartments = item.department;
            console.log(item.department);
            for (const itemDepartment of itemDepartments) {
              for (const userDepartment of userDepartments) {
                if (
                  userDepartment.toLowerCase() == itemDepartment.toLowerCase()
                ) {
                  allowedItems.push(item);
                }
              }
            }
          }
          setItems(allowedItems);
        } else {
          setItems(items);
        }
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
