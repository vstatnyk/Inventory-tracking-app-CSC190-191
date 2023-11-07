import InventoryList from "../components/InventoryList";
import Nav from "../components/Nav";

export default function Inventory() {
  // array for testing
  let items = [
    {id: 1, name: "item 1", stock: 3, checkedOut: 0},
    {id: 2, name: "item 2", stock: 4, checkedOut: 1},
    {id: 3, name: "item 3", stock: 2, checkedOut: 5},
    {id: 4, name: "item 4", stock: 1, checkedOut: 2},
  ];

  return (
    <>
      <h1>Inventory</h1>
      <Nav active = "inventory"/>
      <InventoryList items={items}/>
    </>
  );
}
