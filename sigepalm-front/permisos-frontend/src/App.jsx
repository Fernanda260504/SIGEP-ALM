import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import WarehouseStaff from "./pages/WarehouseStaff";
import ManagerApproval from "./pages/ManagerApproval";
import Reports from "./pages/Reports"
import Staff from "./pages/Staff"
import Setting from "./pages/Setting"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/warehouse" element={<WarehouseStaff />} />
           {/* MANAGER */}
        <Route path="/manager" element={<ManagerApproval />} />
      
        <Route path="/manager/reports" element={<Reports />} />
        <Route path="/manager/staff" element={<Staff />} />
        <Route path="/manager/settings" element={<Setting />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
