import { Link } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";

export default function Nav() {
  const auth = getAuth();

  const handleLogoutClick = () => {
    signOut(auth).then(() => {
      localStorage.removeItem("token");
    });
  };

  return (
    <nav className="nav">
      <ul>
        <li>
          <Link to="/recent">Recent</Link>
        </li>
        <li>
          <Link to="/inventory">Inventory</Link>
        </li>
        <li>
          <Link to="/accounts">Accounts</Link>
        </li>
        <li>
          <button onClick={handleLogoutClick}>Logout</button>
        </li>
      </ul>
    </nav>
  );
}
