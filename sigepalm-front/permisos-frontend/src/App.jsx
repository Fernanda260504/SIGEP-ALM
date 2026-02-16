import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import WarehouseStaff from "./pages/WarehouseStaff";
import ManagerApproval from "./pages/ManagerApproval";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/warehouse" element={<WarehouseStaff />} />
        <Route path="/manager" element={<ManagerApproval />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
