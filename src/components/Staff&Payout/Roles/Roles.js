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
  const companyDetails =
    userDetails.companies[userDetails.selectedCompanyIndex];

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const companyRef = doc(
        db,
        "companies",
        userDetails?.companies[userDetails.selectedCompanyIndex]?.companyId
      );

      const rolesRef = collection(db, "roles");

      const q = query(rolesRef, where("companyRef", "==", companyRef));
      const querySnapshot = await getDocs(q);

      const rolesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setRoles(rolesData);
      setRolesCount({
        total: rolesData.length,
      });
    } catch (error) {
      console.error("Error fetching Roles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, [companyDetails.companyId]);

  const handleAddRole = (newDesignation) => {
    setRoles((prev) => [...prev, newDesignation]);
    setRolesCount((prev) => ({
      total: prev.total + 1,
    }));
  };

  const fileteredRoles = roles.filter((d) =>
    d.roleName.toLowerCase().includes(searchInput.toLowerCase())
  );

  const navigate = useNavigate();

  async function onDeleteRoles(e, roleId) {
    e.stopPropagation();
    try {
      const confirm = window.confirm(
        "Are you sure you want to delete this Role?"
      );
      if (!confirm) return;

      await deleteDoc(doc(db, "roles", roleId));

      setRoles((prev) => {
        const updatedRoles = prev.filter(
          (role) => role.id !== roleId
        );

        setRolesCount({ total: updatedRoles.length });

        return updatedRoles;
      });
    } catch (error) {
      console.error("Error deleting Designation:", error);
    }
  }

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

          <button
            className="bg-blue-500 text-white py-1 px-2 rounded "
            onClick={() => {
              setIsModalOpen(true);
            }}
          >
            + Create Roles
          </button>
        </header>
        <div className="flex items-center bg-white space-x-4 mb-4 border p-2 rounded">
          <input
            type="text"
            placeholder="Search by Designation Name..."
            className=" w-full focus:outline-none"
            onChange={(e) => setSearchInput(e.target.value)}
            value={searchInput}
          />
          <IoSearch />
        </div>
        <div>
          <div className="text-4xl text-blue-700 font-bold">
            {rolesCount.total}
          </div>
          <div>Total Roles</div>
        </div>
        <div>
          {loading ? (
            <div className="text-center py-6">Loading Roles...</div>
          ) : fileteredRoles.length > 0 ? (
            fileteredRoles.map((role) => (
              <div className="mt-4" key={role.id}>
                <div
                  className="bg-white p-4 rounded shadow"
                  key={role.id}
                  onClick={() => navigate(role.roleName)}
                >
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">
                      {role.roleName}
                    </h2>
                    <button
                      onClick={(e) => onDeleteRoles(e, role.id)}
                      className="text-white bg-red-500 h-6 w-6 font-bold text-center rounded-full flex items-center justify-center"
                    >
                      <div className="w-3 h-1 bg-white"></div>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center border-2 shadow cursor-pointer rounded-lg p-3 mt-3">
              No Roles
            </div>
          )}
        </div>

        {isModalOpen && (
          <AddRoleModal
            onClose={() => setIsModalOpen(false)}
            onAddRole={handleAddRole}
          />
        )}
      </div>
    </div>
  );
};

const AddRoleModal = ({ onClose, onAddRole }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [roleName, setRoleName] = useState("");
  const userDetails = useSelector((state) => state.users);
  const companyDetails =
    userDetails.companies[userDetails.selectedCompanyIndex];

  const handleAddRole = async () => {
    if (!roleName.trim()) {
      alert("Role name is required");
      return;
    }
    setIsLoading(true);

    try {
      const newRole = {
        roleName: roleName,
      };

      const companyRef = doc(db, "companies", companyDetails.companyId);

      const payload = {
        ...newRole,
        companyRef: companyRef,
        createdAt: Timestamp.fromDate(new Date()),
      };
      const docRef = await addDoc(collection(db, "roles"), payload);

      onAddRole({ id: docRef.id, ...payload });
      onClose();
    } catch (error) {
      console.error("Error adding Designation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end">
      <div className="bg-white w-full max-w-sm p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Add Role</h2>
        <div className="mb-4">
          <label htmlFor="designationName" className="block text-gray-700 mb-2">
            Role Name
          </label>
          <input
            id="designationName"
            type="text"
            className="w-full p-2 border rounded"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
          />
        </div>
        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleAddRole}
            className={`${
              isLoading ? "bg-blue-300" : "bg-blue-500"
            } text-white px-4 py-2 rounded hover:bg-blue-600 transition`}
            disabled={isLoading}
          >
            {isLoading ? "Adding..." : "Add Role"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Roles;
