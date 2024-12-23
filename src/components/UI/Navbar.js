import React, { useState } from "react";
import { FaBolt, FaBell, FaBullhorn, FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import {
  setUserLogin,
  setUserLogout,
  updateUserDetails,
} from "../../store/UserSlice";
import SunyaLogo from "../../assets/SunyaLogo.jpg";
import { IoMdSettings } from "react-icons/io";

const Navbar = ({ selectedCompany, companyDetails, isStaff }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCompanyOpen, setIsCompanyOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", email: "", phone: "" });
  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state.users);
  const companyName =
    userDetails.companies[userDetails.selectedCompanyIndex].name;
  console.log("selectedCompany", selectedCompany);
  console.log("companyDetails", companyDetails, isStaff);
  function onSwitchCompany(index) {
    const payload = { ...userDetails, selectedCompanyIndex: index };
    dispatch(setUserLogin(payload));
    setIsCompanyOpen(false);
  }
  function onSwitchDashboard(e) {
    const { value } = e.target;
    const payload = { ...userDetails, selectedDashboard: value };
    dispatch(setUserLogin(payload));
    navigate("/" + value);
  }

  const navigate = useNavigate();
  const handleEditClick = () => {
    setIsEditing(true);
    setEditForm({
      name: userDetails.name,
      email: userDetails.email,
      phone: userDetails.phone,
    });
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    dispatch(updateUserDetails(editForm));
    setIsEditing(false);
    setIsProfileOpen(false);
  };
  return (
    <>
      <header className="border-b border-gray-300" style={{ height: "8vh" }}>
        <div className="flex items-center justify-between px-4 h-full">
          <div className="flex items-center space-x-6">
            <Link href="#" className="flex items-center m-3">
              <div>
                <img src={SunyaLogo} width={100} alt="logo" height={100} />
              </div>
              {/* <span className="text-3xl font-extrabold text-gray-800">
                Sunya
              </span> */}
            </Link>

            <div
              className="flex items-center space-x-4 group relative cursor-pointer"
              onClick={() => setIsCompanyOpen(!isCompanyOpen)}
            >
              <div className="bg-orange-400 text-white font-bold w-10 h-10 flex items-center justify-center rounded-full border border-gray-500">
                {isStaff && selectedCompany
                  ? selectedCompany?.slice(0, 2).toUpperCase() || "YB"
                  : userDetails?.companies?.[
                      userDetails.selectedCompanyIndex
                    ]?.name
                      ?.slice(0, 2)
                      .toUpperCase() || "YB"}
              </div>
              <div>
                <span className="font-bold text-gray-800">
                  {isStaff && selectedCompany
                    ? selectedCompany
                    : userDetails.companies[userDetails.selectedCompanyIndex]
                        .name}
                </span>
              </div>
              <div className="absolute z-10 left-0 top-10 w-max px-2 py-1 bg-gray-600 text-white text-xs rounded-md opacity-0 group-hover:opacity-100">
                Change Company
              </div>
            </div>
            <div>
              <select
                className="border-b-2 p-2 px-5"
                value={userDetails.selectedDashboard || ""}
                onChange={onSwitchDashboard}
              >
                <option value="">default</option>
                <option value="customer">customer</option>
                <option value="vendor">vendor</option>
                <option value="staff">staff</option>
              </select>
            </div>
          </div>
          {/* <div className="flex-1 flex items-center justify-center">
            <div className="flex-grow mx-4 max-w-[400px] m-2 relative">
              <input
                type="text"
                placeholder="Search or jump to..."
                className="w-full h-8 p-2 pl-8 border border-gray-300 rounded-md"
              />
              <FaSearch
                className="absolute z-10 left-2 top-1/2 transform -translate-y-1/2 text-gray-600"
                size={16}
              />
            </div> 
          </div> */}

          {userDetails.selectedDashboard === "staff" && (
            <div> You Logged as a Staff in {selectedCompany}'s Company</div>
          )}
          <div className="flex items-center">
            <button
              type="button"
              className="relative group px-2 py-1 rounded-full text-gray-600 hover:text-black ml-[3px]"
            >
              <FaBolt className="text-gray-600" size={16} />
              <div className="absolute z-10 left-1/2 transform -translate-x-1/2 top-8 px-2 py-1 bg-gray-600 text-white text-xs rounded-md opacity-0 group-hover:opacity-100">
                Create
              </div>
            </button>

            <button
              type="button"
              className="relative group px-2 py-1 rounded-full text-gray-600 hover:text-black ml-[3px]"
            >
              <FaBell className="text-gray-600" size={16} />
              <div className="absolute z-10 left-1/2 transform -translate-x-1/2 top-8 px-2 py-1 bg-gray-600 text-white text-xs rounded-md opacity-0 group-hover:opacity-100">
                Notifications
              </div>
            </button>

            <button
              type="button"
              className="relative group px-2 py-1 rounded-full text-gray-600 hover:text-black ml-[3px]"
            >
              <FaBullhorn className="text-gray-600" size={16} />
              <div className="absolute z-10 left-1/2 transform -translate-x-1/2 top-8 px-2 py-1 bg-gray-600 text-white text-xs rounded-md opacity-0 group-hover:opacity-100">
                Announcements
              </div>
            </button>

            {userDetails.selectedDashboard !== "staff" && (
              <button
                type="button"
                className="relative group px-2 py-1 rounded-full text-gray-600 hover:text-black ml-[3px]"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                // onBlur={() => setIsProfileOpen(!isProfileOpen)}
              >
                <FaUserCircle className="text-gray-600" size={16} />
                <div className="absolute z-10 left-1/2 transform -translate-x-1/2 top-8 px-2 py-1 bg-gray-600 text-white text-xs rounded-md opacity-0 group-hover:opacity-100">
                  Profile
                </div>
              </button>
            )}
          </div>
        </div>
      </header>
      {isProfileOpen && (
        <div
          className="fixed pr-2 flex items-start justify-end inset-0 bg-black bg-opacity-10 z-20"
          onClick={() => setIsProfileOpen(false)}
        >
          <div
            className="w-80 bg-white shadow-2xl rounded-lg p-4 text-sm"
            style={{ marginTop: "8vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            {isEditing ? (
              <form onSubmit={handleFormSubmit} className="space-y-3">
                <div className="flex space-x-3 items-center ">
                  <div className="w-12 ">Name: </div>
                  <input
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleInputChange}
                    className="w-full border p-2 rounded"
                    placeholder="Name"
                  />
                </div>
                <div className="flex space-x-3 items-center">
                  <label className="w-12 ">Email: </label>
                  <input
                    type="email"
                    name="email"
                    value={editForm.email}
                    onChange={handleInputChange}
                    className="w-full border p-2 rounded"
                    placeholder="Email"
                  />
                </div>
                <div className="flex space-x-3 items-center">
                  <label className="w-12 ">Phone: </label>
                  <input
                    type="text"
                    name="phone"
                    value={editForm.phone}
                    onChange={handleInputChange}
                    className="w-full border p-2 rounded"
                    placeholder="Phone"
                  />
                </div>

                <div className="flex space-x-2 ">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white w-full rounded py-2"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="bg-gray-200 w-full rounded py-2"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="pb-2 space-y-2">
                  <div>{userDetails.name}</div>
                  <div>FREE</div>
                </div>
                <hr />
                <div className="py-2 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Phone</span>
                    <span>{userDetails.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Email</span>
                    <span>{userDetails.email}</span>
                  </div>
                </div>
                <button
                  className="bg-sky-200 rounded w-full p-2 my-2"
                  onClick={handleEditClick}
                >
                  Edit Profile
                </button>
                <button
                  className="flex items-center space-x-2 text-gray-600 hover:text-black my-2"
                  onClick={() => {
                    navigate("/user");
                    setIsProfileOpen(false);
                  }}
                >
                  <IoMdSettings />
                  <span>Settings</span>
                </button>
                <button
                  className="flex items-center space-x-2 text-gray-600 hover:text-black my-2"
                  onClick={() => {
                    dispatch(setUserLogout());
                  }}
                >
                  <FiLogOut />
                  <span>Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}
      {isCompanyOpen && (
        <div
          className="fixed pr-3 pl-40 inset-0 bg-black bg-opacity-10 z-20"
          onClick={() => setIsCompanyOpen(false)}
          onWheel={() => setIsCompanyOpen(false)}
        >
          <div
            className="w-64 bg-white shadow-2xl rounded-lg "
            style={{ marginTop: "8vh" }}
          >
            <div className="" onClick={(e) => e.stopPropagation()}>
              {companyDetails?.length > 0 ? (
                <>
                  {companyDetails.map((company, index) => (
                    <div
                      className="hover:bg-blue-100 w-full border-b-2 p-2 flex items-center cursor-pointer"
                      key={company.id}
                      //  onClick={() => {
                      //    navigate("/");
                      //    onSwitchCompany(index);
                      //  }}
                    >
                      <div className="bg-orange-400 text-white mr-3 font-bold w-10 h-10 flex items-center justify-center rounded-full border border-gray-500">
                        {company.name?.slice(0, 2).toUpperCase() || "YB"}
                      </div>
                      {company.name}
                    </div>
                  ))}
                </>
              ) : (
                <>
                  {userDetails.companies.map((company, index) => (
                    <div
                      className="hover:bg-blue-100 w-full border-b-2 p-2 flex items-center cursor-pointer"
                      key={company.companyId}
                      onClick={() => {
                        navigate("/");
                        onSwitchCompany(index);
                      }}
                    >
                      <div className="bg-orange-400 text-white mr-3 font-bold w-10 h-10 flex items-center justify-center rounded-full border border-gray-500">
                        {company.name?.slice(0, 2).toUpperCase() || "YB"}
                      </div>
                      {company.name}
                    </div>
                  ))}
                </>
              )}
              <div className="hover:bg-blue-100 w-full  p-2 flex items-center">
                <span className="text-sm text-gray-600 font-medium tracking-tight">
                  + Add Another Company
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
