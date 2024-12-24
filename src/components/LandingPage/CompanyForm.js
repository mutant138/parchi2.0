import { addDoc, collection } from "firebase/firestore";
import { FaUser } from "react-icons/fa";
import { MdOutlineLocationOn, MdOutlineLocalPhone } from "react-icons/md";
import { MdEmail } from "react-icons/md";
import React, { useState } from "react";
import { db } from "../../firebase";

const CompanyForm = (userRef) => {
  const [formData, setFormData] = useState({ name: "" });

  async function onSubmit(e) {
    if (!formData.name) {
      formData.name = "Your Company";
    }
    e.preventDefault();
    try {
      await addDoc(collection(db, "companies"), {
        ...formData,
        ...userRef,
      });
      alert("Successfully Created!");
    } catch (error) {
      console.log("🚀 ~ Submit ~ error:", error);
    }
  }

  function handleChangeInput(e) {
    const { name, value } = e.target;
    setFormData((val) => ({ ...val, [name]: value }));
  }

  return (
    <div className="rounded-lg p-8 max-w-lg mx-auto">
      <h1 className="text-2xl font-semibold mb-6 text-gray-700">Company Details</h1>
      <form onSubmit={onSubmit}>
        <div className="mb-4">
          <label className="block font-medium mb-2">Company Name <span className="text-red-500">*</span></label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <FaUser />
            </span>
            <input
              type="text"
              name="name"
              placeholder="Enter company name"
              className="w-full border border-gray-300 rounded-md pl-10 py-2 focus:ring focus:ring-blue-300"
              onChange={handleChangeInput}
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-2">Address</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 ">
            <MdOutlineLocationOn />
            </span>
            <input
              type="text"
              name="address"
              placeholder="Enter address"
              className="w-full border border-gray-300 rounded-md pl-10 py-2 focus:ring focus:ring-blue-300"
              onChange={handleChangeInput}
            />
          </div>
        </div>

        {/* Repeat similar structure for other fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-2">Phone Number <span className="text-red-500">*</span></label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 ">
              <MdOutlineLocalPhone />
              </span>
              <input
                type="text"
                name="phone"
                placeholder="Enter phone number"
                className="w-full border border-gray-300 rounded-md pl-10 py-2 focus:ring focus:ring-blue-300"
                onChange={handleChangeInput}
                required
              />
            </div>
          </div>
          <div>
            <label className="block font-medium mb-2">Email</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 ">
              <MdEmail />
              </span>
              <input
                type="email"
                name="email"
                placeholder="Enter email address"
                className="w-full border border-gray-300 rounded-md pl-10 py-2 focus:ring focus:ring-blue-300"
                onChange={handleChangeInput}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-between">
          <button
            type="button"
            className="text-blue-600 px-4 py-2 rounded-md hover:underline"
            onClick={onSubmit}
          >
            Skip for Now
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompanyForm;
