import { Link } from "react-router-dom";

export default function Nav() {
    return (
        <nav class="nav">
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
            </ul>
        </nav>
    )
}