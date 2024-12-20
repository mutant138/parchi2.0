import React, { useState, useEffect } from "react";
import Navbar from "../UI/Navbar";
import SideBar from "../UI/Sidebar";
import { Outlet, useLocation } from "react-router-dom";
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

// Modal Component to Show Company Details
const Modal = ({ companyDetails, onClose }) => {
  console.log("companydetails", companyDetails);
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Company Details
        </h2>
        {companyDetails && companyDetails.length > 0 ? (
          <div>
            {companyDetails.map((company, index) => (
              <div
                key={company.id}
                className="p-2 border-b last:border-none cursor-pointer hover:bg-gray-100"
                onClick={() => {}}
              >
                <p>
                  <strong>{index + 1}. Name:</strong> {company.name}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            No companyDetails found for this staff member.
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
  const phone = useSelector((state) => state.users.phone); // User's phone number from Redux
  const [showModal, setShowModal] = useState(false);
  const [companyDetails, setCompanyDetails] = useState(null);

  // Trigger to show modal and fetch company details based on phone number
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

      if (!staffSnapshot.empty) {
        const staffDoc = staffSnapshot.docs[0].data();
        console.log("Staff document:", staffDoc);
        const companyRef = staffDoc.companyRef;
        const companyDoc = await getDocs(companyRef);

        if (companyDoc.exists()) {
          setCompanyDetails(companyDoc.data());
        } else {
          console.error("Company not found");
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
