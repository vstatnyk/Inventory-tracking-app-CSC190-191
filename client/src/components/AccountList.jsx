import { MenuItem, TextField } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useEffect, useState } from "react";
import "swiper/css";
import "swiper/css/grid";
import "swiper/css/pagination";
import { Grid, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import AddAccountDialog from "../components/AddAccountDialog";
import edit from "../images/edit-button.svg";
import del from "../images/trash.svg";
import { deleteUser, registerUser, updateUser } from "../utils/api";
import AlertPopUp from "./AlertPopUp";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";

export default function AccountList({ accounts_p }) {
  const [editState, setEditState] = useState({});
  const [inputValues, setInputValues] = useState({});
  const [accounts, setAccounts] = useState(accounts_p);
  const [prevInputValues, setPrevInputValues] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [alert, setAlert] = useState([]);
  const [loading, setLoading] = useState(false);
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState(null);

  useEffect(() => {
    if (showAlert) {
      setTimeout(() => {
        setShowAlert(false);
      }, 3500);
    }
  }, [showAlert]);

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
    setLoading(true);
    const updatedAccount = { ...accounts.find((i) => i.uid === id) };
    Object.keys(updatedAccount).forEach((property) => {
      updatedAccount[property] = inputValues[`${property}${id}`];
    });
    setAccounts((accounts) =>
      accounts.map((account) => (account.uid === id ? updatedAccount : account))
    );
    handleEditClick(id); // Close the edit mode
    console.log(id);
    await updateUser(
      id,
      inputValues[`email${id}`],
      inputValues[`password${id}`],
      inputValues[`role${id}`],
      inputValues[`department${id}`],
      localStorage.getItem("token")
    );
    setLoading(false);
    setAlert(["Account updated successfully", "success"]);
    setShowAlert(true);
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

  const handleDeleteDialogOpen = (id) => {
    setOpenDeleteDialog(true);
    setAccountToDelete(id);
  }

  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
  }

  const handleDeleteAccount = async (id) => {
    setLoading(true);
    const updatedAccounts = accounts.filter((account) => account.uid !== id);
    setAccounts(updatedAccounts);
    // should be updated to relevant account deletion api
    await deleteUser(id, localStorage.getItem("token"));
    setLoading(false);
    setAlert(["Account deleted successfully", "success"]);
    setShowAlert(true);
    handleDeleteDialogClose();
  };

  // handles changeRole Drop down
  const handleChangeRole = (id, value) => {
    const updatedAccount = { ...accounts.find((i) => i.uid === id) };

    // Modify the existing account to new access Level
    updatedAccount.customClaims.accessLevel = mapAccessLevelToInt(value);
    setInputValues((prevInputValues) => ({
      ...prevInputValues,
      [`role${id}`]: mapAccessLevelToInt(value),
    }));
  };

  const mapAccessLevelToString = (accessLevel) => {
    switch (accessLevel) {
      case 1:
        return "Employee";
      case 2:
        return "Supervisor";
      case 3:
        return "Manager";
      case 4:
        return "Admin";
      default:
        return "Unknown";
    }
  };

  // handles input as a string and returns int
  // corresponding to accessLevel
  const mapAccessLevelToInt = (accessLevel) => {
    switch (accessLevel) {
      case "Employee":
        return 1;
      case "Supervisor":
        return 2;
      case "Manager":
        return 3;
      case "Admin":
        return 4;
      default:
        return "Unknown";
    }
  };

  return (
    <>
      <AddAccountDialog setAccounts={setAccounts}></AddAccountDialog>
      <div
        style={{ display: "flex", justifyContent: "center", margin: "10px 0" }}
      >
        <TextField
          select
          label="Filter by Department"
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          variant="outlined"
          style={{ width: "200px" }}
        >
          <MenuItem value="">All Departments</MenuItem>
          <MenuItem value="Office">Office</MenuItem>
          <MenuItem value="Finance">Finance</MenuItem>
          <MenuItem value="Public Outreach">Public Outreach</MenuItem>
          <MenuItem value="Lab">Lab</MenuItem>
          <MenuItem value="Operations">Operations</MenuItem>
          <MenuItem value="Shop">Shop</MenuItem>
          <MenuItem value="Fisheries">Fisheries</MenuItem>
          <MenuItem value="IT">IT</MenuItem>
        </TextField>
      </div>
      {showAlert && <AlertPopUp message={alert[0]} type={alert[1]} />}
      {loading && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={open}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      <Swiper
        slidesPerView={3}
        grid={{
          rows: 2,
          fill: "row",
        }}
        spaceBetween={15}
        modules={[Grid, Pagination]}
        pagination={{
          dynamicBullets: true,
          clickable: true,
        }}
        className="accountSwiper"
      >
        {accounts
          .filter((account) => {
            const included =
              !departmentFilter ||
              (account.departments &&
                account.departments.includes(departmentFilter));
            console.log("Filtering:", account.name, "Included:", included);
            return included;
          })
          .map((account) => (
            <SwiperSlide key={account.uid}>
              <div className="account">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
                  alt="Placeholder"
                  className="placeholder-image"
                  style={{ width: "75px", height: "75px" }}
                />
                {Object.keys(account).map((property) => (
                  <div className="accountRow" key={property}>
                    {property === "customClaims" ? null : (
                      <>
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
                              handleInputChange(
                                property,
                                e.target.value,
                                account
                              )
                            }
                          >
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
                              handleInputChange(
                                property,
                                e.target.value,
                                account
                              )
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
                              handleInputChange(
                                property,
                                e.target.value,
                                account
                              )
                            }
                          />
                        )}
                      </>
                    )}
                    {property !== "customClaims" && <br />}
                  </div>
                ))}
                <div className="accountRow">
                  Role:{" "}
                  {account.customClaims &&
                    mapAccessLevelToString(account.customClaims.accessLevel)}
                  {editState[account.uid] && (
                    <select
                      id={`changeRole${account.uid}`}
                      onChange={(e) =>
                        handleChangeRole(account.uid, e.target.value)
                      }
                    >
                      <option value="Employee">Employee</option>
                      <option value="Supervisor">Supervisor</option>
                      <option value="Manager">Manager</option>
                      <option value="Admin">Admin</option>
                    </select>
                  )}
                </div>
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
                        onClick={() => handleDeleteDialogOpen(account.uid)}
                      >
                        <img src={del} alt="Delete Item" className="image" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </SwiperSlide>
          ))}
      </Swiper>
      <Dialog open={openDeleteDialog} onClose={handleDeleteDialogClose}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'center' }}>
          Are you sure you want to delete?
        </DialogTitle>
        <center>
          <DialogActions sx={{ display: 'flex', justifyContent: 'center' }}>
          <button onClick={() => handleDeleteAccount(accountToDelete)} color="primary" autoFocus>
            Confirm
          </button>
            <button onClick={handleDeleteDialogClose} color="primary">
              Cancel
            </button>
          </DialogActions>
        </center>
      </Dialog>
    </>
  );
}
