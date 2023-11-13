import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import Accounts from "./pages/Accounts";
import Inventory from "./pages/Inventory";
import Login from "./pages/Login";
import NoPage from "./pages/NoPage";
import RecentTransactions from "./pages/RecentTransactions";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route index element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/recent" element={<RecentTransactions />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/accounts" element={<Accounts />} />
          <Route path="*" element={<NoPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
