import React from "react";
import SettingsView from "./SettingView";
import { MdMailOutline } from "react-icons/md";
import { FaSquarePhone } from "react-icons/fa6";
import { CgProfile } from "react-icons/cg";
const Prefix = () => {
  return (
    <div className="flex">
      <div className="w-1/4">
        {" "}
        <SettingsView />
      </div>
      <div className="p-6 bg-gray-100 w-full  max-h-screen overflow-y-auto">
        <div className="mx-auto bg-white shadow-md rounded-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-700">Prefix</h1>
          </div>
          <form className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-36 h-36 bg-gray-200 border border-dashed border-gray-400 flex items-center justify-center rounded relative hover:border-blue-500">
                <label
                  htmlFor="image-upload"
                  className="absolute inset-0 flex items-center justify-center cursor-pointer text-gray-500 text-sm"
                >
                  Upload
                </label>

                <input
                  id="image-upload"
                  type="file"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  accept="image/*"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-600">Name</label>

                <div className="relative">
                  <CgProfile className="absolute w-6 h-6 text-gray-400 top-1/2 left-3 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Name"
                    className="w-full border border-gray-300 rounded pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-600">Phone Number</label>
                <div className="relative">
                  <FaSquarePhone className="absolute w-6 h-6 text-gray-400 top-1/2 left-3 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Phone Number"
                    className="w-full border border-gray-300 rounded pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-600">Email</label>
                <div className="relative">
                  <MdMailOutline className="absolute w-6 h-6 text-gray-400 top-1/2 left-3 transform -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full border border-gray-300 rounded pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="text-right">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded"
              >
                Save & Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Prefix;
