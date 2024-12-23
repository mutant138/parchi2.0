import React from "react";

const CompanyForm = () => {
  return (
    <div className="">
      <h1 className="text-2xl font-semibold mb-4">Company Details</h1>

      <div className="mb-4">
        <label className="block font-medium mb-1">
          Logo <span className="text-gray-500">(Optional)</span>:
        </label>
        <div className="flex items-center border border-gray-300 rounded-md p-4">
          <div className="w-16 h-16 border-2 border-dashed border-gray-400 flex justify-center items-center rounded-md">
            <span className="text-gray-400 text-sm">+</span>
          </div>
          <button className="ml-4 text-blue-600 hover:underline">
            Upload Logo
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium mb-1">
            Company Name <span className="text-red-500">*</span>:
          </label>
          <input
            type="text"
            placeholder="Enter company name"
            className="w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Address:</label>
          <input
            type="text"
            placeholder="Enter address"
            className="w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">City:</label>
          <input
            type="text"
            placeholder="Enter city"
            className="w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Pincode:</label>
          <input
            type="text"
            placeholder="Enter pincode"
            className="w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">GST:</label>
          <input
            type="text"
            placeholder="Enter GST number"
            className="w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">PAN Number:</label>
          <input
            type="text"
            placeholder="Enter PAN number"
            className="w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Email:</label>
          <input
            type="email"
            placeholder="Enter email address"
            className="w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">
            Phone Number <span className="text-red-500">*</span>:
          </label>
          <input
            type="text"
            placeholder="Enter phone number"
            className="w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-300"
            readOnly
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          Submit
        </button>
      </div>
    </div>
  );
};

export default CompanyForm;
