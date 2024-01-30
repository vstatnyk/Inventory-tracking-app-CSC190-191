import { useEffect, useState } from "react";
import AccountList from "../components/AccountList";
import Nav from "../components/Nav";
import { CheckLoginStatus } from "../functions/CheckLoginStatus";
import { getUsers } from "../utils/api";

export default function Accounts() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getUsers(localStorage.getItem("token"));
        setUsers(users);
      } catch (error) {
        console.error("Error fetching users:", error.message);
      }
    };

    fetchUsers();
  }, []);

  return (
    <>
      {CheckLoginStatus() === true ? (
        <>
          {/* <h1>Accounts</h1> */}
          <Nav active="accounts" />
          <AccountList accounts_p={users} />
        </>
      ) : (
        <></> // CheckLoginStatus() false
      )}
    </>
  );
}
