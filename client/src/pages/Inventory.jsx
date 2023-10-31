import Nav from "../components/Nav";
import Inventorylist from "../components/InventoryList";
import { useState, useEffect } from 'react';

export default function Inventory() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/items", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setItems(data);
        console.log(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  return (
    <>
      <h1>Inventory</h1>
      <Nav />
      <Inventorylist items={items} />
    </>
  );
}
