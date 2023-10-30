import React, { useState, useEffect } from "react";

export default function Inventory({ items }) {
    const [editState, setEditState] = useState({});
    const [inputValues, setInputValues] = useState({});

    useEffect(() => {
        const initialInputValues = {};
        items.forEach((item) => {
            Object.keys(item).forEach((property) => {
                initialInputValues[`${property}${item.id}`] = item[property];
            });
        });
        setInputValues(initialInputValues);
    }, [items]);

    const handleEditClick = (itemId) => {
        setEditState((prevState) => ({
            ...prevState,
            [itemId]: !prevState[itemId],
        }));
    };

    const handleInputChange = (property, value, item) => {
        console.log(property + item.id);
        setInputValues((prevValues) => ({
            ...prevValues,
            [property + item.id]: value,
        }));
    };

    return (
        <div className="inventoryContainer">
            {items.map((item) => (
                <div className="inventoryItem" key={item.id}>
                    {Object.keys(item).map((property) => (
                        <div className="inventoryRow" key={property}>
                            {property}:
                            <input
                                type="text"
                                className="inventoryInput"
                                style={{ border: editState[item.id] ? "1px solid white" : "1px solid transparent" }}
                                disabled={!editState[item.id]}
                                id={`${property}${item.id}`}
                                value={inputValues[`${property}${item.id}`]}
                                onChange={(e) => handleInputChange(property, e.target.value, item)}
                            />
                            <br/>
                        </div>
                    ))}
                    <br/>
                    <button
                        id={`button${item.id}`}
                        onClick={() => handleEditClick(item.id)}
                    >
                        {editState[item.id] ? "Save" : "Edit"}
                    </button>
                </div>
            ))}
        </div>
    );
}
