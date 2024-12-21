import React, { useState, useEffect } from "react";
import Navbar from "../UI/Navbar";
import SideBar from "../UI/Sidebar";
import {
  Routes,
  Route,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import InvoiceList from "../Invoices/InvoiceList";
import InvoiceView from "../Invoices/InvoiceView/InvoiceView";
import SetInvoice from "../Invoices/SetInvoice/SetInvoice";
import Quotation from "../Quotation/Quotation";
import QuotationViewHome from "../Quotation/QuotationView/QuotationViewHome";
import SetQuotation from "../Quotation/SetQuotation/SetQuotation";
import CreateProject from "../Projects/CreateProject/CreateProject";
import ProjectView from "../Projects/ProjectView/ProjectView";
import Users from "../Projects/ProjectView/Users/Users";
import Tasks from "../Projects/ProjectView/Tasks/Tasks";
import Milestone from "../Projects/ProjectView/Milestone/Milestone";
import Files from "../Projects/ProjectView/Files/Files";
import Approval from "../Projects/ProjectView/Approvals/Approval";
import Payment from "../Projects/ProjectView/Payment/Payment";
import Items from "../Projects/ProjectView/Items/Items";
import Chats from "../Projects/ProjectView/Chats/Chats";
import CustomerList from "../Customers/CustomerList";
import CustomerView from "../Customers/CustomerView/CustomerView";
import VendorList from "../Vendors/VendorList";
import VendorView from "../Vendors/VendorView/VendorView";
import Purchase from "../Purchase/Purchase";
import PurchaseViewHome from "../Purchase/PurchaseView/PurchaseViewHome";
import SetPurchase from "../Purchase/SetPurchase/SetPurchase";

const Modal = ({
  companyDetails,
  onClose,
  setSelectedCompanyName,
  setSelectedCompany,
}) => {
  console.log("Company details:", companyDetails);
  const navigate = useNavigate();
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Company Details{" "}
        </h2>
        {companyDetails && companyDetails.length > 0 ? (
          <div>
            {companyDetails.map((company, index) => (
              <div
                key={company.id}
                className="p-2 border-b last:border-none cursor-pointer hover:bg-gray-100"
                onClick={() => {
                  navigate("invoice");
                  setSelectedCompanyName(company.name);
                  setSelectedCompany(company);
                }}
              >
                <p>
                  <strong>{index + 1}. Name:</strong> {company.name}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            No company details found for this staff member.
          </p>
        )}
        <div className="mt-6 flex justify-center">
          <button
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const StaffHome = () => {
  const location = useLocation();
  const phone = useSelector((state) => +state.users.phone);
  // User's phone number from Redux
  console.log("Phone:", phone);
  console.log("type phone", typeof phone, phone);
  const [showModal, setShowModal] = useState(false);
  const [companyDetails, setCompanyDetails] = useState(null);
  const [roles, setRoles] = useState([]);
  const [selectedCompanyName, setSelectedCompanyName] = useState("");
  const [selectedCompany, setSelectedCompany] = useState(null);
  useEffect(() => {
    if (location.pathname === "/staff") {
      setShowModal(true);
      if (phone) {
        fetchCompanyDetails(phone);
      }
    } else {
      setShowModal(false);
    }
  }, [location, phone]);
  const fetchCompanyDetails = async (phone) => {
    try {
      const staffQuery = query(
        collection(db, "staff"),
        where("phone", "==", phone)
      );
      const staffSnapshot = await getDocs(staffQuery);
      console.log("Staff snapshot:", staffSnapshot.docs);
      console.log("staffSnap", staffSnapshot);

      if (!staffSnapshot.empty) {
        const staffDoc = staffSnapshot.docs.map((doc) => doc.data());
        console.log("Staff document:", staffDoc);
        const staffSidebar = staffDoc.map((staff) => {
          if (staff.roles) {
            console.log("role", staff.roles);
            return Object.keys(staff.roles).filter((role) => staff.roles[role]);
          }
          return [];
        });
        const companyPromises = staffDoc.map(async (staff) => {
          if (staff.companyRef) {
            const companyDoc = await getDoc(staff.companyRef);
            return companyDoc.exists() ? companyDoc.data() : null;
          }
          return null;
        });

        const companies = await Promise.all(companyPromises);

        if (companies.length > 0) {
          console.log("All associated companies:", companies);
          setCompanyDetails(companies);
        } else {
          console.error("No valid companies found for this staff member.");
          setCompanyDetails(null);
        }
        setRoles(staffSidebar);
      } else {
        console.error("Staff not found");
        setCompanyDetails(null);
      }
    } catch (error) {
      console.error("Error fetching company details:", error);
      setCompanyDetails(null);
    }
  };
  console.log("roles", roles);
  const closeModal = () => {
    setShowModal(false);
  };
  console.log("selected company", selectedCompany);
  return (
    <div>
      <div style={{ height: "8vh" }}>
        <Navbar selectedCompany={selectedCompanyName} />
      </div>
      <div className="flex" style={{ height: "92vh" }}>
        <div>{!showModal && <SideBar staff={roles} />}</div>
        <div style={{ width: "100%", height: "92vh" }} className="bg-gray-100">
          <Routes>
            {roles.length > 0 && roles[0].includes("CreateInvoice") && (
              <>
                <Route
                  path="/invoice"
                  element={
                    <InvoiceList
                      companyDetails={selectedCompany}
                      isStaff={true}
                    />
                  }
                ></Route>
                <Route path="/invoice/:id" element={<InvoiceView />}></Route>
                <Route
                  path="/invoice/create-invoice"
                  element={<SetInvoice />}
                ></Route>
                <Route
                  path="/invoice/:invoiceId/edit-invoice"
                  element={<SetInvoice />}
                ></Route>
              </>
            )}
            {roles.length > 0 && roles[0].includes("CreateQuotation") && (
              <>
                <Route path="/quotation" element={<Quotation />}></Route>
                <Route
                  path="/quotation/:id"
                  element={<QuotationViewHome />}
                ></Route>
                <Route
                  path="/quotation/create-quotation"
                  element={<SetQuotation />}
                ></Route>
                <Route
                  path="/quotation/:quotationId/edit-quotation"
                  element={<SetQuotation />}
                ></Route>
              </>
            )}
            {roles.length > 0 && roles[0].includes("CreatePurchase") && (
              <>
                <Route path="/purchase" element={<Purchase />}></Route>
                <Route
                  path="/purchase/:id"
                  element={<PurchaseViewHome />}
                ></Route>
                <Route
                  path="/purchase/create-purchase"
                  element={<SetPurchase />}
                ></Route>
                <Route
                  path="/purchase/:purchaseId/edit-purchase"
                  element={<SetPurchase />}
                ></Route>
              </>
            )}
            {roles.length > 0 && roles[0].includes("CreateProject") && (
              <>
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
                <Route
                  path="/projects/:id/payments"
                  element={<Payment />}
                ></Route>
                <Route path="/projects/:id/items" element={<Items />}></Route>
                <Route path="/projects/:id/chats" element={<Chats />}></Route>
              </>
            )}
            {roles.length > 0 && roles[0].includes("CreateCustomers") && (
              <>
                <Route path="/customers" element={<CustomerList />}></Route>
                <Route path="/customers/:id" element={<CustomerView />}></Route>
              </>
            )}
            {roles.length > 0 && roles[0].includes("CreateVendors") && (
              <>
                <Route path="/vendors" element={<VendorList />}></Route>
                <Route path="/vendors/:id" element={<VendorView />}></Route>
              </>
            )}
          </Routes>

          <Outlet />
        </div>
      </div>
      {showModal && (
        <Modal
          companyDetails={companyDetails}
          onClose={closeModal}
          setSelectedCompanyName={setSelectedCompanyName}
          setSelectedCompany={setSelectedCompany}
        />
      )}
    </div>
  );
};

export default StaffHome;
