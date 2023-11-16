import { useEffect, useState } from "react";
import edit from "../images/edit-button.svg";
import del from "../images/trash.svg";

export default function AccountList({ accounts_p }) {
  const [editState, setEditState] = useState({});
  const [inputValues, setInputValues] = useState({});
  const [accounts, setAccounts] = useState(accounts_p);
  const [prevInputValues, setPrevInputValues] = useState({});

  const nextItemId = Math.max(...accounts.map((account) => account.id), 0) + 1;

  useEffect(() => {
    const initialInputValues = {};
    accounts.forEach((account) => {
      Object.keys(account).forEach((property) => {
        initialInputValues[`${property}${account.id}`] = account[property];
      });
    });
    setInputValues(initialInputValues);
  }, [accounts]);

  const changeEditState = (id) => {
    setEditState((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const handleEditClick = (id) => {
    changeEditState(id);
    const newPrevInputValues = { ...prevInputValues };
    Object.keys(accounts[0]).forEach((property) => {
      newPrevInputValues[`${property}${id}`] = inputValues[`${property}${id}`];
    });
    setPrevInputValues(newPrevInputValues);
  };

  const handleCancelClick = (id) => {
    setInputValues((inputValues) => {
      Object.keys(accounts[0]).forEach((property) => {
        inputValues[`${property}${id}`] = prevInputValues[`${property}${id}`];
      });
      return { ...inputValues };
    });
    changeEditState(id);
  };

  const handleInputChange = (property, value, account) => {
    // Validate input based on property
    if (
      (property === "id" && /^\d*$/.test(value)) || // Allow only numbers for id
      (property === "name" && /^[a-zA-Z\s]*$/.test(value)) // Allow only letters and spaces for name
    ) {
      setInputValues((prevInputValues) => ({
        ...prevInputValues,
        [`${property}${account.id}`]: value,
      }));
    }
  };

  const handleSaveClick = (id) => {
    const updatedAccount = { ...accounts.find((i) => i.id === id) };
    Object.keys(updatedAccount).forEach((property) => {
      updatedAccount[property] = inputValues[`${property}${id}`];
    });
    setAccounts((accounts) =>
      accounts.map((account) => (account.id === id ? updatedAccount : account))
    );
    changeEditState(id); // Close the edit mode
  };

  const handleAddAccount = async () => {
    const newItemObject = {
      id: nextItemId,
      name: "new name",
      email: "new email",
      role: "user",
    };
    setAccounts([...accounts, newItemObject]);
    // needs to be updated to relevant account creation api?
    //await createItem("Testing check", "This is a new variable", 0, localStorage.getItem("token"));
  };

  const handleDeleteAccount = async (id) => {
    const updatedAccounts = accounts.filter((account) => account.id !== id);
    setAccounts(updatedAccounts);
    // should be updated to relevant account deletion api
    //await deleteItem('654cba23c3cd420a26de383a',localStorage.getItem("token") );
  };

  return (
    <div className="accountContainer">
      <button onClick={handleAddAccount}>Add Account</button>
      {accounts.map((account) => (
        <div className="account" key={account.id}>
          {Object.keys(account).map((property) => (
            <div className="accountRow" key={property}>
              {property}:
              {property === "role" ? (
                <select
                  className="accountInput"
                  style={{
                    border: editState[account.id]
                      ? "1px solid white"
                      : "1px solid transparent",
                  }}
                  disabled={!editState[account.id]}
                  id={`${property}${account.id}`}
                  value={inputValues[`${property}${account.id}`]}
                  onChange={(e) =>
                    handleInputChange(property, e.target.value, account)
                  }
                >
                  {/* Add your role options here */}
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              ) : (
                <input
                  type="text"
                  className="accountInput"
                  style={{
                    border: editState[account.id]
                      ? "1px solid white"
                      : "1px solid transparent",
                  }}
                  disabled={!editState[account.id]}
                  id={`${property}${account.id}`}
                  value={inputValues[`${property}${account.id}`]}
                  onChange={(e) =>
                    handleInputChange(property, e.target.value, account)
                  }
                />
              )}
              <br />
            </div>
          ))}
          <br />
          <div className="accountButtons">
            {editState[account.id] ? (
              <div className="accountButtonContainer">
                <button
                  id={`saveButton${account.id}`}
                  onClick={() => handleSaveClick(account.id)}
                >
                  Save
                </button>
                <button
                  id={`button${account.id}`}
                  onClick={() => handleCancelClick(account.id)}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="buttonContainer">
                <button
                  id={`button${account.id}`}
                  onClick={() => handleEditClick(account.id)}
                >
                  <img src={edit} alt="Edit Item" className="image" />
                </button>
                <button
                  id={`button${account.id}`}
                  onClick={() => handleDeleteAccount(account.id)}
                >
                  <img src={del} alt="Delete Item" className="image" />
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
