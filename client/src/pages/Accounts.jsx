import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useEffect, useState } from "react";
import AccountList from "../components/AccountList";
import AddAccountDialog from "../components/AddAccountDialog";
import Nav from "../components/Nav";
import { CheckLoginStatus } from "../functions/CheckLoginStatus";
import { getUsers } from "../utils/api";

export default function Accounts() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    console.log("Accounts.jsx: useEffect");
    const fetchUsers = async () => {
      try {
        const users = await getUsers(localStorage.getItem("token"));
        setUsers(users);
      } catch (error) {
        console.error("Error fetching users:", error.message);
      }
    };

    fetchUsers();
    setLoading(false);
  }, []);

  return (
    <>
      {CheckLoginStatus() === true ? (
        <>
          {loading && (
            <Backdrop
              sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={open}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
          )}
          {/* <h1>Accounts</h1> */}
          <Nav active="accounts" />
          <AddAccountDialog></AddAccountDialog>
          <AccountList accounts_p={users} />
        </>
      ) : (
        <></> // CheckLoginStatus() false
      )}
    </>
  );
}
