import React from "react";
import Navbar from "../UI/Navbar";
import SideBar from "../UI/Sidebar";
import { Outlet, Route, Routes } from "react-router-dom";
import InvoiceList from "../Invoices/InvoiceList";
import InvoiceView from "../Invoices/InvoiceView/InvoiceView";
import Quotation from "../Quotation/Quotation";
import Projects from "../Projects/Projects";
import ProjectView from "../Projects/ProjectView/ProjectView";
import Tasks from "../Projects/ProjectView/Tasks/Tasks";
import Milestone from "../Projects/ProjectView/Milestone/Milestone";
import Files from "../Projects/ProjectView/Files/Files";
import Approval from "../Projects/ProjectView/Approvals/Approval";
import Items from "../Projects/ProjectView/Items/Items";
import Chats from "../Projects/ProjectView/Chats/Chats";
import QuotationViewHome from "../Quotation/QuotationView/QuotationViewHome";

function CustomerHome() {
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
            <Route path="/invoiceList" element={<InvoiceList />}></Route>
            <Route path="/invoiceList/:id" element={<InvoiceView />}></Route>
            <Route path="/quotation" element={<Quotation />}></Route>
            <Route
              path="/quotation/:id"
              element={<QuotationViewHome />}
            ></Route>
            <Route path="/projects" element={<Projects />}></Route>
            <Route path="/projects/:id" element={<ProjectView />} />
            <Route path="/projects/:id/tasks" element={<Tasks />}></Route>
            <Route
              path="/projects/:id/milestones"
              element={<Milestone />}
            ></Route>
            <Route path="/projects/:id/files" element={<Files />}></Route>
            <Route
              path="/projects/:id/approvals"
              element={<Approval />}
            ></Route>
            <Route path="/projects/:id/items" element={<Items />}></Route>
            <Route path="/projects/:id/chats" element={<Chats />}></Route>
          </Routes>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default CustomerHome;
