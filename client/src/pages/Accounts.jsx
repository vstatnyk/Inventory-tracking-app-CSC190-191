import Nav from "../components/Nav";
import InventoryList from "../components/AccountList"
import { CheckLoginStatus } from "../functions/CheckLoginStatus";

export default function Accounts() {
    // array for testing
    let accounts = [
      {id: 1, name: "name 1", email: "email 1", role: "admin"},
      {id: 2, name: "name 2", email: "email 2", role: "admin"},
      {id: 3, name: "name 3", email: "email 3", role: "user"},
      {id: 4, name: "name 4", email: "email 4", role: "user"},
    ];
  return (
    <>
      {CheckLoginStatus() === true ? (
        <>
          <h1>Accounts</h1>
          <Nav active="accounts" />
          <InventoryList accounts_p={accounts}/>
        </>
      ) : (
        <></> // CheckLoginStatus() false
      )}
    </>
  );
}
