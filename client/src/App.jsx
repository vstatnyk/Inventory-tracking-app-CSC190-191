import { BrowserRouter, Route, Routes } from "react-router-dom";
import PrivateRoutes from "./components/PrivateRoutes";
import "./index.css";
import Accounts from "./pages/Accounts";
import CheckInOut from "./pages/CheckInOut";
import Inventory from "./pages/Inventory";
import Login from "./pages/Login";
import NoPage from "./pages/NoPage";
import QRCodes from "./pages/QRCodes";
import RecentTransactions from "./pages/RecentTransactions";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PrivateRoutes />}>
            <Route path="/recent" element={<RecentTransactions />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/accounts" element={<Accounts />} />
            <Route path="/checkinout/:id" element={<CheckInOut />} />
            <Route path="/qrcode" element={<QRCodes />} />
          </Route>
          <Route index element={<Login />} />
          <Route path="/login" element={<Login />} />
          {/* <Route path="/checkinout" element={<CheckInOut />} /> */}
          <Route path="*" element={<NoPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
