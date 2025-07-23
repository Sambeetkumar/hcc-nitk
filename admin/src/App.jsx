import React, { useContext } from "react";
import Login from "./pages/Login";
import { AdminContext } from "./context/AdminContext";
import { DoctorContext } from "./context/DoctorContext";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/admin/Dashboard";
import AddDoctor from "./pages/admin/AddDoctor";
import AllAppointments from "./pages/admin/AllAppointments";
import DoctorsList from "./pages/admin/DoctorsList";
import DocAppointments from "./pages/doctor/DocAppointments";
import DocDashboard from "./pages/doctor/DocDashboard";
import DocProfile from "./pages/doctor/DocProfile";
function App() {
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);
  return aToken||dToken ? (
    <div className="bg-[#F8F9FD]">
      <Navbar />
      <div className="flex items-start">
        <Sidebar />
        <Routes>
          {/* Admin Route */}
          <Route path="/" element={<></>} />
          <Route path="/admin-dashboard" element={<Dashboard />} />
          <Route path="/all-appointments" element={<AllAppointments />} />
          <Route path="/add-doctor" element={<AddDoctor />} />
          <Route path="/doctor-list" element={<DoctorsList />} />
          {/* Doctor Route */}
          <Route path="/doctor-dashboard" element={<DocDashboard />} />
          <Route path="/doctor-appointments" element={<DocAppointments />} />
          <Route path="/doctor-profile" element={<DocProfile />} />
        </Routes>
      </div>
    </div>
  ) : (
    <>
      <Login />
    </>
  );
}

export default App;
