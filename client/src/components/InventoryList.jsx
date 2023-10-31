import React, { useState, useEffect } from "react";

export default function InventoryList({ items }) {
  const [editState, setEditState] = useState({});
  const [inputValues, setInputValues] = useState({});
  const [inventoryItems, setInventoryItems] = useState(items);

  const nextItemId = Math.max(...inventoryItems.map((item) => item.id), 0) + 1;

  useEffect(() => {
    const initialInputValues = {};
    inventoryItems.forEach((item) => {
      Object.keys(item).forEach((property) => {
        initialInputValues[`${property}${item.id}`] = item[property];
      });
    });
    setInputValues(initialInputValues);
  }, [inventoryItems]);

  const handleEditClick = (itemId) => {
    setEditState((prevState) => ({
      ...prevState,
      [itemId]: !prevState[itemId],
    }));
  };

  const handleInputChange = (property, value, item) => {
    setInputValues((prevInputValues) => ({
      ...prevInputValues,
      [`${property}${item.id}`]: value,
    }));
  };

  const handleSaveClick = (itemId) => {
    const updatedItem = { ...inventoryItems.find((i) => i.id === itemId) };
    Object.keys(updatedItem).forEach((property) => {
      updatedItem[property] = inputValues[`${property}${itemId}`];
    });

    setInventoryItems((items) =>
      items.map((item) => (item.id === itemId ? updatedItem : item))
    );
    handleEditClick(itemId); // Close the edit mode
  };

  const handleAddItem = () => {
    const newItemObject = {
      id: nextItemId,
      name: "New Item",
      stock: 0,
      checkedOut: 0,
    };
    setInventoryItems([...inventoryItems, newItemObject]);
  };

  const handleDeleteItem = (itemId) => {
    const updatedItems = inventoryItems.filter((item) => item.id !== itemId);
    setInventoryItems(updatedItems);
  };

  return (
    <div className="inventoryContainer">
      <button onClick={handleAddItem}>Add Item</button>
      {inventoryItems.map((item) => (
        <div className="inventoryItem" key={item.id}>
          {Object.keys(item).map((property) => (
            <div className="inventoryRow" key={property}>
              {property}:
              <input
                type="text"
                className="inventoryInput"
                style={{
                  border: editState[item.id]
                    ? "1px solid white"
                    : "1px solid transparent",
                }}
                disabled={!editState[item.id]}
                id={`${property}${item.id}`}
                value={inputValues[`${property}${item.id}`]}
                onChange={(e) =>
                  handleInputChange(property, e.target.value, item)
                }
              />
              <br />
            </div>
          ))}
          <br />
          <div className="inventoryButtons">
            {editState[item.id] ? (
              <>
                <button
                  id={`saveButton${item.id}`}
                  onClick={() => handleSaveClick(item.id)}
                >
                  Save
                </button>
                <button
                  id={`button${item.id}`}
                  onClick={() => handleEditClick(item.id)}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                id={`button${item.id}`}
                onClick={() => handleEditClick(item.id)}
              >
                Edit
              </button>
            )}
            <button
              id={`button${item.id}`}
              onClick={() => handleDeleteItem(item.id)}
            >
              Delete Item
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}