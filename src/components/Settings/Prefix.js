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
            <div className="flex justify-between">
              <div className="w-1/4">
                <label className="block text-gray-600 text-xl">Invoice:</label>
              </div>
              <div className="w-3/4">
                <input
                  type="text"
                  placeholder="Prefix for Invoice"
                  className="bg-gray-40 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 block w-full p-2  hover:border-blue-500 hover:shadow-md hover:shadow-blue-300"
                />
              </div>
            </div>
            <div className="flex justify-between">
              <div className="w-1/4">
                <label className="block text-gray-600 text-xl">Service:</label>
              </div>

              <div className="w-3/4">
                <input
                  type="text"
                  placeholder="Prefix for Service"
                  className="bg-gray-40 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 block w-full p-2  hover:border-blue-500 hover:shadow-md hover:shadow-blue-300"
                />
              </div>
            </div>
            <div className="flex justify-between">
              <div className="w-1/4">
                <label className="block text-gray-600 text-xl">
                  Quotation:
                </label>
              </div>
              <div className="w-3/4">
                <input
                  type="text"
                  placeholder="Prefix for Quoation"
                  className="bg-gray-40 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 block w-full p-2  hover:border-blue-500 hover:shadow-md hover:shadow-blue-300"
                />
              </div>
            </div>
            <div className="flex justify-between">
              <div className="w-1/4">
                <label className="block text-gray-600 text-xl">Purchase:</label>
              </div>
              <div className="w-3/4">
                <input
                  type="text"
                  placeholder="Prefix for Purchase"
                  className="bg-gray-40 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 block w-full p-2  hover:border-blue-500 hover:shadow-md hover:shadow-blue-300"
                />
              </div>
            </div>
            <div className="flex justify-between">
              <div className="w-1/4">
                <label className="block text-gray-600 text-xl">
                  ProForma Invoice:
                </label>
              </div>
              <div className="w-3/4">
                <input
                  type="text"
                  placeholder="Prefix for ProFormaInvoice"
                  className="bg-gray-40 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 block w-full p-2  hover:border-blue-500 hover:shadow-md hover:shadow-blue-300"
                />
              </div>
            </div>
            <div className="flex justify-between">
              <div className="w-1/4">
                <label className="block text-gray-600 text-xl">PO:</label>
              </div>
              <div className="w-3/4">
                <input
                  type="text"
                  placeholder="Prefix for PO"
                  className="bg-gray-40 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 block w-full p-2  hover:border-blue-500 hover:shadow-md hover:shadow-blue-300"
                />
              </div>
            </div>
            <div className="flex justify-between">
              <div className="w-1/4">
                <label className="block text-gray-600 text-xl">
                  Delivery Challan:
                </label>
              </div>
              <div className="w-3/4">
                <input
                  type="text"
                  placeholder="Prefix for DeliveryChallan"
                  className="bg-gray-40 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 block w-full p-2  hover:border-blue-500 hover:shadow-md hover:shadow-blue-300"
                />
              </div>
            </div>
            <div className="flex justify-between">
              <div className="w-1/4">
                <label className="block text-gray-600 text-xl">
                  Credit Note:
                </label>
              </div>
              <div className="w-3/4">
                <input
                  type="text"
                  placeholder="Prefix for CreditNote"
                  className="bg-gray-40 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 block w-full p-2  hover:border-blue-500 hover:shadow-md hover:shadow-blue-300"
                />
              </div>
            </div>
            <div className="flex justify-between">
              <div className="w-1/4">
                <label className="block text-gray-600 text-xl">POS:</label>
              </div>
              <div className="w-3/4">
                <input
                  type="text"
                  placeholder="Prefix for POS"
                  className="bg-gray-40 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 block w-full p-2  hover:border-blue-500 hover:shadow-md hover:shadow-blue-300"
                />
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
