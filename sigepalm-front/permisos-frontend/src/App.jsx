import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import WarehouseStaff from "./pages/WarehouseStaff";
import ManagerApproval from "./pages/ManagerApproval";
import Reports from "./pages/Reports"
import Staff from "./pages/Staff";


import MyPermissions from "./pages/Mypermissions";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
          {/* Almacenista */}
        <Route path="/warehouse" element={<WarehouseStaff />} />
        <Route path="/warehouse/permissions" element={<MyPermissions />} />
            <Route path="/warehouse/permissions" element={<MyPermissions />} />
       
       

           {/* Administrador */}
        <Route path="/manager" element={<ManagerApproval />} />
        <Route path="/manager/reports" element={<Reports />} />
        <Route path="/manager/staff" element={<Staff />} />
       
      </Routes>
    </BrowserRouter>
  );
}

export default App;
