import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { useEffect, useState } from "react";
import QRCode from "qrcode.react";
import edit from "../images/edit-button.svg";
import del from "../images/trash.svg";
import { createItem, deleteItem, updateItem } from "../utils/api";

export default function InventoryList({ items }) {
  const [editState, setEditState] = useState({});
  const [inputValues, setInputValues] = useState({});
  const [inventoryItems, setInventoryItems] = useState(items);
  const [prevInputValues, setPrevInputValues] = useState({});
  const [qrcodes, setQrcodes] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    setInventoryItems(items);
  }, [items]);

  useEffect(() => {
    const initialInputValues = {};
    inventoryItems.forEach((item) => {
      Object.keys(item).forEach((property) => {
        initialInputValues[`${property}${item._id}`] = item[property];
      });
    });
    setInputValues(initialInputValues);

    // Generate QR codes for all items
    const qrCodeData = {};
    inventoryItems.forEach((item) => {
      qrCodeData[item._id] = generateQRCode(item);
    });
    setQrcodes(qrCodeData);
  }, [inventoryItems]);

  const generateQRCode = (item) => {
    const qrCodeData = {
      department: item.department,
      _id: item._id,
      name: item.name,
      description: item.description,
      quantity: item.quantity,
    };

    const qrCodeString = JSON.stringify(qrCodeData);
    return <QRCode value={qrCodeString} />;
  };

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

  const handleSaveClick = async (itemId) => {
    const updatedItem = { ...inventoryItems.find((i) => i._id === itemId) };
    Object.keys(updatedItem).forEach((property) => {
      updatedItem[property] = inputValues[`${property}${itemId}`];
    });

    setInventoryItems((items) =>
      items.map((item) => (item._id === itemId ? updatedItem : item))
    );
    handleEditClick(itemId);
    await updateItem(
      itemId,
      inputValues[`name${itemId}`],
      inputValues[`description${itemId}`],
      inputValues[`quantity${itemId}`],
      localStorage.getItem("token"),
      inputValues[`department${itemId}`]
    );

    // Regenerate QR code after item update
    setQrcodes((prevQrcodes) => ({
      ...prevQrcodes,
      [itemId]: generateQRCode(updatedItem),
    }));
  };

  const handleAddItem = async () => {
    const newItemObject = {
      name: "New Item",
      description: "This is a new item",
      quantity: 0,
      department: "Your Department",
    };
    setInventoryItems([...inventoryItems, newItemObject]);
    const newItem = await createItem(
      newItemObject.name,
      newItemObject.description,
      newItemObject.quantity,
      localStorage.getItem("token"),
      newItemObject.department
    );

    // Generate QR code for the new item
    setQrcodes((prevQrcodes) => ({
      ...prevQrcodes,
      [newItem._id]: generateQRCode(newItem),
    }));
  };

  function checkItems(e) {
    let isSelected = e.target.checked;
    let value = e.target.value;

    if(isSelected) {
      setSelectedItems( [...selectedItems, value])
    }
    else{
      setSelectedItems((prevData) => {
        return prevData.filter((_id) => {
          return _id != value
        })
      })
    }
  }

  function checkAll(){
    if( inventoryItems.length === selectedItems.length){
      setSelectedItems( [] );
    }
    else {
      const postIds = inventoryItems.map((item)=>{
        return item._id
      });
      
      setSelectedItems( postIds );
    }
  }

  const handleDeleteItem = async () => {
    while(selectedItems.length > 0){
      const newItemObject = selectedItems[0];
      const updatedItems = inventoryItems.filter((item) => item._id !== newItemObject);
      setInventoryItems(updatedItems);
      await deleteItem(newItemObject, localStorage.getItem("token"));
      // Remove QR code for the deleted item
      setQrcodes((prevQrcodes) => {
      const newQrcodes = { ...prevQrcodes };
      delete newQrcodes[newItemObject];
      return newQrcodes;
      });
      selectedItems.splice(0, 1);
    }
  };


  const AccordionStyle = {
    justifyContent: "center",
    height: "auto",
    width: "95%",
    margin: "auto",
    backgroundColor: "#7f7f7f",
    color: "white",
    marginBottom: "5px",
    marginTop: "5px",

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
      <button type="button" onClick={checkAll} >{ inventoryItems.length === selectedItems.length ? 'Unselect All' : 'Select all' }</button>
      <button onClick={handleAddItem}>Add Item</button>
      <button onClick={handleDeleteItem}>Delete Item</button>
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
            <div>
              <label>
                <input type="checkbox" checked={ selectedItems.includes( item._id )} value={item._id} onChange={checkItems}  />
              </label>
              {item.name}
              </div>
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

            <div className="inventoryButtons"></div>

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
              </div>
            )}
            {/* Display the QR code for each item */}
            <div className="qrCodeContainer">{qrcodes[item._id]}</div>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}
