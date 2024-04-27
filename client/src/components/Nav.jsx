import { getAuth, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import PropTypes from "prop-types";

export default function Nav({ active }) {
  const navigate = useNavigate();
  Nav.propTypes = {
    active: PropTypes.string.isRequired,
  };

  const [activePage, setActive] = useState(false);

  useEffect(() => {
    setActive(active);
  }, [active]);

  const auth = getAuth();

  const handleLogoutClick = () => {
    signOut(auth).then(() => {
      localStorage.removeItem("token");
      navigate("/");
    });
  };

  return (
    <nav className="nav">
      <ul>
        <li>
          {activePage === "recent" ? (
            <Link to="/recent" className="active">
              Recent
            </Link>
          ) : (
            <Link to="/recent">Recent</Link>
          )}
        </li>
        <li>
          {activePage === "inventory" ? (
            <Link to="/inventory" className="active">
              Inventory
            </Link>
          ) : (
            <Link to="/inventory">Inventory</Link>
          )}
        </li>
        <li>
          {activePage === "accounts" ? (
            <Link to="/accounts" className="active">
              Accounts
            </Link>
          ) : (
            <Link to="/accounts">Accounts</Link>
          )}
        </li>
        <li>
          <Link to="/inventory">
            <button className="logoutBtn" onClick={handleLogoutClick}>
              Logout
            </button>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
