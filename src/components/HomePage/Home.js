import React from "react";
import SideBar from "../UI/Sidebar";
import Navbar from "../UI/Navbar";
import InvoiceList from "../Invoices/InvoiceList";
import CreateInvoice from "../Invoices/CreateInvoice/CreateInvoice";
import {
  Routes,
  Route,
  Outlet,
  useLocation,
  matchPath,
} from "react-router-dom";
import VendorList from "../Vendors/VendorList";
import ProductHome from "../Products/ProductHome";
import Projects from "../Projects/Projects";
import ProjectView from "../Projects/ProjectView/ProjectView";
import CreateProject from "../Projects/CreateProject/CreateProject";
import CustomerList from "../Customers/CustomerList";
import Tasks from "../Projects/ProjectView/Tasks/Tasks";
import Milestone from "../Projects/ProjectView/Milestone/Milestone";
import Files from "../Projects/ProjectView/Files/Files";
import Approval from "../Projects/ProjectView/Approvals/Approval";
import Users from "../Projects/ProjectView/Users/Users";
import StaffPayout from "../Staff&Payout/StaffPayout";
import Staff from "../Staff&Payout/Staff/Staff";
import Items from "../Projects/ProjectView/Items/Items";
import Chats from "../Projects/ProjectView/Chats/Chats";
import CustomerView from "../Customers/CustomerView/CustomerView";
import VendorView from "../Vendors/VendorView/VendorView";
import StaffView from "../Staff&Payout/Staff/StaffView/StaffView";
import PO from "../PO/PO";
import CreatePo from "../PO/CreatePo";
import Branches from "../Staff&Payout/Branches/Branches";
import Roles from "../Staff&Payout/Roles/Roles";
import Services from "../Services/Services";
import ServicesList from "../ServicesList/ServicesList";
import CreateService from "../Services/CreateService/CreateService";
import InvoiceView from "../Invoices/InvoiceView/InvoiceView";
import Expense from "../Expense/Expense";
import BookList from "../Expense/Book/BookList";
import Quotation from "../Quotation/Quotation";
import CreateQuotation from "../Quotation/CreateInvoice/CreateQuotation";
import QuotationViewHome from "../Quotation/QuotationView/QuotationViewHome";
import POS from "../POS/POS";
import POSViewHome from "../POS/POSView/POSViewHome";
import CreatePOS from "../POS/CreatePOS/CreatePOS";
import ProFormaInvoice from "../ProFormaInvoice/ProFormaInvoice";
import CreateProFormaInvoice from "../ProFormaInvoice/CreateProFormaInvoice/CreateProFormaInvoice";
import ProFormaView from "../ProFormaInvoice/ProFormaInvoiceView/ProFormaView";
import Reminder from "../Reminder/Reminder";
import Designation from "../Staff&Payout/Designation/Designation";
import Assets from "../Staff&Payout/Assets/Assets";
import Attendance from "../Staff&Payout/Attendance/Attendance";
import DesignationView from "../Staff&Payout/Designation/DesignationView";
import EditInvoice from "../Invoices/CreateInvoice/EditInvoice";
import EditService from "../Services/CreateService/EditService";

const Home = () => {
  const location = useLocation();

  const matchPathList = [
    "/invoiceList/create-invoice",
    "/projects/create-Project",
    "/customer/:id",
    "/vendor/:id",
    "/staff-payout/staff/:id",
    "/create-po",
    "/services/create-service",
  ];

  const noSideBarPagesList = matchPathList.find((path) =>
    matchPath({ path }, location.pathname)
  );

  return (
    <div>
      <div style={{ height: "8vh" }}>
        <Navbar />
      </div>
      <div className="flex" style={{ height: "92vh" }}>
        {/* {!noSideBarPagesList && ( */}
        <div>
          <SideBar />
        </div>
        {/* )} */}
        <div style={{ width: "100%", height: "92vh" }} className="bg-gray-100">
          <Routes>
            <Route path="/invoiceList" element={<InvoiceList />}></Route>
            <Route path="/invoiceList/:id" element={<InvoiceView />}></Route>
            <Route
              path="/invoiceList/create-invoice"
              element={<CreateInvoice />}
            ></Route>
            <Route
              path="/invoiceList/:id/edit-invoice"
              element={<EditInvoice />}
            ></Route>
            <Route path="/quotation" element={<Quotation />}></Route>
            <Route
              path="/quotation/:id"
              element={<QuotationViewHome />}
            ></Route>
            <Route
              path="/quotation/create-quotation"
              element={<CreateQuotation />}
            ></Route>
            <Route
              path="/pro-forma-invoice"
              element={<ProFormaInvoice />}
            ></Route>
            <Route
              path="/pro-forma-invoice/:id"
              element={<ProFormaView />}
            ></Route>
            <Route
              path="/pro-forma-invoice/create-invoice"
              element={<CreateProFormaInvoice />}
            ></Route>
            <Route path="/pos" element={<POS />}></Route>
            <Route path="/pos/:id" element={<POSViewHome />}></Route>
            <Route path="/pos/create-pos" element={<CreatePOS />}></Route>
            <Route path="/customer" element={<CustomerList />}></Route>
            <Route path="/customer/:id" element={<CustomerView />}></Route>
            <Route path="/vendor" element={<VendorList />}></Route>
            <Route path="/vendor/:id" element={<VendorView />}></Route>
            <Route path="/products" element={<ProductHome />}></Route>
            <Route path="/services-list" element={<ServicesList />}></Route>
            <Route path="/projects" element={<Projects />}></Route>
            <Route
              path="/projects/create-project"
              element={<CreateProject />}
            ></Route>
            <Route path="/projects/:id" element={<ProjectView />} />
            <Route path="/projects/:id/user" element={<Users />} />
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
            <Route path="/staff-payout" element={<StaffPayout />}></Route>
            <Route path="/staff-payout/staff" element={<Staff />}></Route>
            <Route
              path="/staff-payout/staff/:id"
              element={<StaffView />}
            ></Route>
            <Route path="/staff-payout/branches" element={<Branches />}></Route>
            <Route
              path="/staff-payout/designations"
              element={<Designation />}
            ></Route>
            <Route
              path="/staff-payout/designations/:id"
              element={<DesignationView />}
            ></Route>
            <Route path="/staff-payout/roles" element={<Roles />}></Route>
            <Route path="/staff-payout/assets" element={<Assets />}></Route>
            <Route
              path="/staff-payout/attendance"
              element={<Attendance />}
            ></Route>

            <Route path="/services" element={<Services />}></Route>
            <Route
              path="/services/create-service"
              element={<CreateService />}
            ></Route>
            <Route
              path="/services/:id/edit-service"
              element={<EditService />}
            ></Route>
            <Route path="/chats" element={<Chats />}></Route>
            <Route path="/po" element={<PO />}></Route>
            <Route path="/create-po" element={<CreatePo />}></Route>
            <Route path="/reminder" element={<Reminder />}></Route>
            <Route path="/expense" element={<BookList />}></Route>
            <Route path="/expense/:id" element={<Expense />}></Route>
          </Routes>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Home;