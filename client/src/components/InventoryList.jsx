import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { useEffect, useState } from "react";
import edit from "../images/edit-button.svg";
import del from "../images/trash.svg";
import { createItem, deleteItem } from "../utils/api";

export default function InventoryList({ items }) {
  const [editState, setEditState] = useState({});
  const [inputValues, setInputValues] = useState({});
  const [inventoryItems, setInventoryItems] = useState(items);
  const [prevInputValues, setPrevInputValues] = useState({});

  // const nextItemId = Math.max(...inventoryItems.map((item) => item._id), 0) + 1;

  //sets inventoryItems to items when items changes
  useEffect(() => {
    setInventoryItems(items);
  }, [items]);

  //sets inputValues to items when items changes
  useEffect(() => {
    const initialInputValues = {};
    inventoryItems.forEach((item) => {
      Object.keys(item).forEach((property) => {
        initialInputValues[`${property}${item._id}`] = item[property];
      });
    });
    setInputValues(initialInputValues);
  }, [inventoryItems]);

  //changes editState when button is clicked
  const changeEditState = (id) => {
    setEditState((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const handleCancelClick = (id) => {
    setInputValues((inputValues) => {
      Object.keys(items[0]).forEach((property) => {
        inputValues[`${property}${id}`] = prevInputValues[`${property}${id}`];
      });
      return { ...inputValues };
    });
    changeEditState(id);
  };

  const handleEditClick = (itemId) => {
    changeEditState(itemId);
    const newPrevInputValues = { ...prevInputValues };
    Object.keys(items[0]).forEach((property) => {
      newPrevInputValues[`${property}${itemId}`] =
        inputValues[`${property}${itemId}`];
    });
    setPrevInputValues(newPrevInputValues);
  };

  const handleInputChange = (property, value, item) => {
    setInputValues((prevInputValues) => ({
      ...prevInputValues,
      [`${property}${item._id}`]: value,
    }));
  };

  const handleSaveClick = (itemId) => {
    const updatedItem = { ...inventoryItems.find((i) => i._id === itemId) };
    Object.keys(updatedItem).forEach((property) => {
      updatedItem[property] = inputValues[`${property}${itemId}`];
    });

    setInventoryItems((items) =>
      items.map((item) => (item._id === itemId ? updatedItem : item))
    );
    handleEditClick(itemId); // Close the edit mode
  };

  const handleAddItem = async () => {
    const newItemObject = {
      _id: Math.random().toString(36).substr(2, 9), // Generate a random id
      name: "New Item",
      stock: 0,
      checkedOut: 0,
    };
    setInventoryItems([...inventoryItems, newItemObject]);
    await createItem(
      "Testing check",
      "This is a new variable",
      0,
      localStorage.getItem("token")
    );
  };

  const handleDeleteItem = async (itemId) => {
    const updatedItems = inventoryItems.filter((item) => item._id !== itemId);
    setInventoryItems(updatedItems);
    await deleteItem(itemId, localStorage.getItem("token"));
  };

  //styles for MUI components
  const AccordionStyle = {
    justifyContent: "center",
    height: "auto",
    width: "95%",
    margin: "auto",
    backgroundColor: "#7f7f7f",
    color: "white",
    marginBottom: "5px",
    marginTop: "5px",
    //text size

    // style for when accordion is expanded
    "&.Mui-expanded": {
      justifyContent: "center",
      height: "auto",
      width: "95%",
      margin: "auto",
      backgroundColor: "#7f7f7f",
      color: "white",
      marginBottom: "5px",
      marginTop: "5px",
    },
  };

  return (
    <div>
      <button onClick={handleAddItem}>Add Item</button>
      {inventoryItems.map((item) => (
        <Accordion
          className="inventoryEntry"
          key={item._id}
          sx={AccordionStyle}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <div>{item.name}</div>
          </AccordionSummary>

          <AccordionDetails className="inventoryDetails">
            {Object.keys(item).map((property) => (
              <div className="inventoryRow" key={property}>
                {property}:
                <input
                  type="text"
                  className="inventoryInput"
                  style={{
                    border: editState[item._id]
                      ? "1px solid white"
                      : "1px solid transparent",
                  }}
                  disabled={!editState[item._id]}
                  id={`${property}${item._id}`}
                  value={inputValues[`${property}${item._id}`] || ""}
                  onChange={(e) =>
                    handleInputChange(property, e.target.value, item)
                  }
                />
                <br />
              </div>
            ))}

            <div className="inventoryButtons"> </div>

            {editState[item._id] ? (
              <div className="buttonContainer">
                <button
                  id={`saveButton${item._id}`}
                  onClick={() => handleSaveClick(item._id)}
                >
                  Save
                </button>
                <button
                  id={`button${item._id}`}
                  onClick={() => handleCancelClick(item._id)}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="buttonContainer">
                <button
                  id={`button${item._id}`}
                  onClick={() => handleEditClick(item._id)}
                >
                  <img src={edit} alt="Edit Item" className="image" />
                </button>
                <button
                  id={`button${item._id}`}
                  onClick={() => handleDeleteItem(item._id)}
                >
                  <img src={del} alt="Delete Item" className="image" />
                </button>
              </div>
            )}
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}
