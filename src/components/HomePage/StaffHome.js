import React from "react";
import Navbar from "../UI/Navbar";
import SideBar from "../UI/Sidebar";
import { Outlet, Route, Routes } from "react-router-dom";
import StaffHome from "../StaffDashboard/StaffHome";

const StaffHome = () => {
    return (
        <div>
        <div style={{ height: "8vh" }}>
            <Navbar />
        </div>
        <div className="flex" style={{ height: "92vh" }}>
            <div>
            <SideBar />
            </div>
            <div style={{ width: "100%", height: "92vh" }} className="bg-gray-100">
            <Routes>
                <Route path="/staff" element={<StaffHome />}></Route>
            </Routes>
            <Outlet />
            </div>
        </div>
        </div>
    );
}