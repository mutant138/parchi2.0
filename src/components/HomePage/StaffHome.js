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

const Modal = ({ companyDetails, onClose }) => {
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
      } else {
        console.error("Staff not found");
        setCompanyDetails(null);
      }
    } catch (error) {
      console.error("Error fetching company details:", error);
      setCompanyDetails(null);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      <div style={{ height: "8vh" }}>
        <Navbar />
      </div>
      <div className="flex" style={{ height: "92vh" }}>
        <div>{!showModal && <SideBar />}</div>
        <div style={{ width: "100%", height: "92vh" }} className="bg-gray-100">
          <Routes>
            <Route>
              <Route
                path="/invoice"
                element={
                  <InvoiceList companyDetails={companyDetails} isStaff={true} />
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
            </Route>
          </Routes>
          <Outlet />
        </div>
      </div>
      {showModal && (
        <Modal companyDetails={companyDetails} onClose={closeModal} />
      )}
    </div>
  );
};

export default StaffHome;
