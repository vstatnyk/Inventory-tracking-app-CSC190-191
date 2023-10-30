import Nav from "../components/Nav"
import Inventorylist from "../components/InventoryList"

export default function Inventory() {
  // array for testing
  let items = [
    {id: 1, name: "item 1", stock: 3, checkedOut: 0},
    {id: 2, name: "item 2", stock: 4, checkedOut: 1},
    {id: 3, name: "item 3", stock: 2, checkedOut: 5},
    {id: 4, name: "", stock: 1, checkedOut: 1},
  ];

  return (
    <>
      <h1>Inventory</h1>
      <Nav/>
      <Inventorylist items={items}/>
    </>
  );
}
