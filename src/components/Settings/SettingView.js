import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const SettingsView = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <div className="w-full bg-white shadow-lg">
        <ul className="p-6 space-y-4 cursor-pointer">
          <li className="font-bold text-gray-700">Profile</li>
          <ul className="pl-4 mt-5">
            <li
              className={`mt-3 font-medium ${
                location.pathname === "/user/user-profile"
                  ? "text-blue-600"
                  : "text-gray-500"
              }`}
              onClick={() => {
                navigate("/user/user-profile");
              }}
            >
              User Profile
            </li>
            <li
              className={`mt-3 font-medium ${
                location.pathname === "/user/company-profile" ||
                location.pathname === "/user"
                  ? "text-blue-600"
                  : "text-gray-500"
              }`}
              onClick={() => {
                navigate("/user/company-profile");
              }}
            >
              Company Profile
            </li>
            <li
              className={`mt-3 font-medium ${
                location.pathname === "/user/prefix"
                  ? "text-blue-600"
                  : "text-gray-500"
              }`}
              onClick={() => {
                navigate("/user/prefix");
              }}
            >
              Prefix
            </li>{" "}
          </ul>
        </ul>
      </div>
    </div>
  );
};

export default SettingsView;
