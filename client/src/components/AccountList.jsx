import { useEffect, useState } from "react";
import edit from "../images/edit-button.svg";
import del from "../images/trash.svg";
import { deleteUser, registerUser, updateUser } from "../utils/api";

export default function AccountList({ accounts_p }) {
  const [editState, setEditState] = useState({});
  const [inputValues, setInputValues] = useState({});
  const [accounts, setAccounts] = useState(accounts_p);
  const [prevInputValues, setPrevInputValues] = useState({});

  useEffect(() => {
    setAccounts(accounts_p);
  }, [accounts_p]);

  useEffect(() => {
    const initialInputValues = {};
    accounts.forEach((account) => {
      Object.keys(account).forEach((property) => {
        initialInputValues[`${property}${account.uid}`] = account[property];
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
    setInputValues((prevInputValues) => ({
      ...prevInputValues,
      [`${property}${account.uid}`]: value,
    }));
  };

  const handleSaveClick = async (id) => {
    const updatedAccount = { ...accounts.find((i) => i.uid === id) };
    Object.keys(updatedAccount).forEach((property) => {
      updatedAccount[property] = inputValues[`${property}${id}`];
    });
    setAccounts((accounts) =>
      accounts.map((account) => (account.uid === id ? updatedAccount : account))
    );
    handleEditClick(id); // Close the edit mode
    await updateUser(
      id,
      inputValues[`email${id}`],
      inputValues[`password${id}`],
      inputValues[`role${id}`],
      localStorage.getItem("token")
    );
  };

  const handleAddAccount = async () => {
    const newUserObject = {
      email: "testing@testing.com",
      password: "testing123",
      role: 4,
    };
    setAccounts([...accounts, newUserObject]);
    await registerUser(
      newUserObject.email,
      newUserObject.password,
      newUserObject.role,
      localStorage.getItem("token")
    );
  };

  const handleDeleteAccount = async (id) => {
    const updatedAccounts = accounts.filter((account) => account.uid !== id);
    setAccounts(updatedAccounts);
    // should be updated to relevant account deletion api
    await deleteUser(id, localStorage.getItem("token"));
  };

  return (
    <div className="accountContainer">
      {accounts.map((account) => (
        <div className="account" key={account.uid}>
          {Object.keys(account).map((property) => (
            <div className="accountRow" key={property}>
              {property}:
              {property === "role" ? (
                <select
                  className="accountInput"
                  style={{
                    border: editState[account.uid]
                      ? "1px solid white"
                      : "1px solid transparent",
                  }}
                  disabled={!editState[account.uid]}
                  id={`${property}${account.uid}`}
                  value={inputValues[`${property}${account.uid}`]}
                  onChange={(e) =>
                    handleInputChange(property, e.target.value, account)
                  }
                >
                  {/* Add your role options here */}
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              ) : property === "uid" ? (
                <input
                  type="text"
                  className="accountInput"
                  style={{
                    border: editState[account.uid]
                      ? "1px solid white"
                      : "1px solid transparent",
                  }}
                  disabled={true}
                  id={`${property}${account.uid}`}
                  value={inputValues[`${property}${account.uid}`]}
                  onChange={(e) =>
                    handleInputChange(property, e.target.value, account)
                  }
                />
              ) : (
                <input
                  type="text"
                  className="accountInput"
                  style={{
                    border: editState[account.uid]
                      ? "1px solid white"
                      : "1px solid transparent",
                  }}
                  disabled={!editState[account.uid]}
                  id={`${property}${account.uid}`}
                  value={inputValues[`${property}${account.uid}`]}
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
            {editState[account.uid] ? (
              <div className="accountButtonContainer">
                <button
                  id={`saveButton${account.uid}`}
                  onClick={() => handleSaveClick(account.uid)}
                >
                  Save
                </button>
                <button
                  id={`button${account.uid}`}
                  onClick={() => handleCancelClick(account.uid)}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="buttonContainer">
                <button
                  id={`button${account.uid}`}
                  onClick={() => handleEditClick(account.uid)}
                >
                  <img src={edit} alt="Edit Item" className="image" />
                </button>
                <button
                  id={`button${account.uid}`}
                  onClick={() => handleDeleteAccount(account.uid)}
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
