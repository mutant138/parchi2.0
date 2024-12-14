import React from "react";
import Navbar from "../UI/Navbar";
import SideBar from "../UI/Sidebar";
import { Outlet, Route, Routes } from "react-router-dom";
import Projects from "../Projects/Projects";
import ProjectView from "../Projects/ProjectView/ProjectView";
import Files from "../Projects/ProjectView/Files/Files";
import Approval from "../Projects/ProjectView/Approvals/Approval";
import VendorPO from "../VendorDashBoard/VendorPO";

function VendorHome() {
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
            <Route path="/po" element={<VendorPO />}></Route>
            {/* <Route path="vendor/quotation" element={<Quotations />}></Route>
            <Route path="vendor/projects" element={<Projects />}></Route>
            <Route path="vendor/projects/:id" element={<ProjectView />} />
            <Route
              path="vendor/projects/:id/files"
              element={<Files />}
            ></Route>
            <Route
              path="vendor/projects/:id/approvals"
              element={<Approval />}
            ></Route> */}
          </Routes>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default VendorHome;
