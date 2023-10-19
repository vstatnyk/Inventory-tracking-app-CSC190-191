import Nav from "../components/Nav"
import { Link } from "react-router-dom";

export default function Login() {
  return (
    <>
      <h1>Login</h1>
        <button>
          <Link to="/inventory">Login button</Link>
        </button>
    </>
  );
}
