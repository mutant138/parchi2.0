import React, { useState, useEffect } from "react";
import { db } from "../../../firebase";
import {
  doc,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  Timestamp,
  query,
  where,
} from "firebase/firestore";
import { useSelector } from "react-redux";
import { IoSearch } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineArrowLeft } from "react-icons/ai";

const Roles = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roles, setRoles] = useState([]);
  const [rolesCount, setRolesCount] = useState({
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const userDetails = useSelector((state) => state.users);
  const [staffData, setStaffData] = useState([]);

  const companyDetails =
    userDetails.companies[userDetails.selectedCompanyIndex];
  async function fetchStaffData() {
    try {
      setLoading(true);
      const companyRef = doc(db, "companies", companyDetails.companyId);

      const q = query(
        collection(db, "staff"),
        where("companyRef", "==", companyRef)
      );
      const getData = await getDocs(q);
      const staffData = getData.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStaffData(staffData);
    } catch (error) {
      console.log("🚀 ~ fetchStaffData ~ error:", error);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchStaffData();
  }, [companyDetails.companyId]);

  return (
    <div className="w-full" style={{ width: "100%", height: "92vh" }}>
      <div
        className="px-8 pb-8 pt-5 bg-gray-100"
        style={{ width: "100%", height: "92vh" }}
      >
        <header className="flex items-center justify-between mb-3">
          <div className="flex space-x-3">
            <Link
              className="flex items-center bg-gray-300 text-gray-700 py-1 px-4 rounded-full transform hover:bg-gray-400 hover:text-white transition duration-200 ease-in-out"
              to="/staff-payout"
            >
              <AiOutlineArrowLeft className="w-5 h-5 mr-2" />
            </Link>

            <h1 className="text-2xl font-bold">Roles</h1>
          </div>
        </header>
        {/* <div className="flex items-center bg-white space-x-4 mb-4 border p-2 rounded">
          <input
            type="text"
            placeholder="Search by Designation Name..."
            className=" w-full focus:outline-none"
            onChange={(e) => setSearchInput(e.target.value)}
            value={searchInput}
          />
          <IoSearch />
        </div> */}
        {/* <div>
          <div className="text-4xl text-blue-700 font-bold">
            {rolesCount.total}
          </div>
          <div>Total Roles</div>
        </div> */}
        <div>
          {loading ? (
            <div className="text-center py-6">Loading Roles...</div>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Roles;
