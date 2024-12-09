import { addDoc, collection, doc, Timestamp } from "firebase/firestore";
import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useSelector } from "react-redux";
import { db } from "../../../firebase";

function CreateStaff({ isOpen, onClose, staffAdded }) {
  const userDetails = useSelector((state) => state.users);

  const companyId =
    userDetails.companies[userDetails.selectedCompanyIndex].companyId;
  const [formData, setFormData] = useState({
    address: "",
    city: "",
    companyRef: "",
    dateOfJoining: "",
    designation: "",
    emailId: "",
    idNo: "",
    isdailywages: false,
    name: "",
    pan: "",
    paymentdetails: 0,
    phone: "",
  });

  const handlePhoneNumberChange = (event) => {
    const inputValue = event.target.value;
    const isValidPhoneNumber = /^\d{0,10}$/.test(inputValue);

    if (isValidPhoneNumber) {
      setFormData((val) => ({ ...val, phone: event.target.value }));
    }
  };

  async function onSubmit(e) {
    e.preventDefault();
    try {
      const companyRef = doc(db, "companies", companyId);
      const payload = { ...formData, companyRef };
      await addDoc(collection(db, "staff"), payload);
      alert("Successfully Created Staff");
      staffAdded();
      onClose();
    } catch (error) {
      console.log("🚀 ~ onSubmit ~ error:", error);
    }
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex justify-end bg-black bg-opacity-25 transition-opacity ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={onClose}
    >
      <div
        className={`bg-white w-96 p-3 pt-2 transform transition-transform overflow-y-auto ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ maxHeight: "100vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold ">Create Staff</h2>
        <button
          onClick={onClose}
          className="absolute text-3xl top-4 right-4 text-gray-600 hover:text-gray-900 cursor-pointer"
        >
          <IoMdClose />
        </button>
        <form className="space-y-1" onSubmit={onSubmit}>
          <div>
            <label className="text-sm block font-semibold ">Name</label>
            <input
              type="text"
              name="Name"
              className="w-full border border-gray-300 p-2 rounded-md  focus:outline-none"
              placeholder="Name"
              required
              onChange={(e) =>
                setFormData((val) => ({ ...val, name: e.target.value }))
              }
            />
          </div>
          <div>
            <label className="text-sm block font-semibold ">Phone</label>
            <div className="flex items-center mb-4">
              <span className="px-3 py-2 bg-gray-200 border border-r-0 rounded-l-md text-gray-700">
                +91
              </span>
              <input
                type="text"
                maxLength="10"
                value={formData.phone}
                onChange={(e) => handlePhoneNumberChange(e)}
                placeholder="Enter your mobile number"
                className="px-4 py-2 border w-full focus:outline-none"
                required
              />
            </div>
          </div>
          <div>
            <label className="text-sm block font-semibold">ID No.</label>
            <input
              type="text"
              name="idNo"
              className="w-full border border-gray-300 p-2 rounded-md  focus:outline-none"
              placeholder="ID No."
              onChange={(e) =>
                setFormData((val) => ({ ...val, idNo: e.target.value }))
              }
            />
          </div>
          <div>
            <label className="text-sm block font-semibold ">Joining Date</label>
            <input
              type="date"
              name="joiningDate"
              className="w-full border border-gray-300 p-2 rounded-md  focus:outline-none"
              placeholder="Joining Date"
              onChange={(e) =>
                setFormData((val) => ({
                  ...val,
                  dateOfJoining: Timestamp.fromDate(new Date(e.target.value)),
                }))
              }
            />
          </div>
          <div>
            <label className="text-sm block font-semibold ">Email</label>
            <input
              type="email"
              name="Email"
              className="w-full border border-gray-300 p-2 rounded-md  focus:outline-none"
              placeholder="Email"
              onChange={(e) =>
                setFormData((val) => ({ ...val, emailId: e.target.value }))
              }
            />
          </div>
          <div>
            <label className="text-sm block font-semibold ">Address</label>
            <input
              type="text"
              name="Address"
              className="w-full border border-gray-300 p-2 rounded-md  focus:outline-none"
              placeholder="Address"
              onChange={(e) =>
                setFormData((val) => ({ ...val, address: e.target.value }))
              }
            />
          </div>
          <div>
            <label className="text-sm block font-semibold ">City</label>
            <input
              type="text"
              name="City"
              className="w-full border border-gray-300 p-2 rounded-md  focus:outline-none"
              placeholder="City"
              onChange={(e) =>
                setFormData((val) => ({ ...val, city: e.target.value }))
              }
            />
          </div>
          <div>
            <label className="text-sm block font-semibold ">Role</label>
            <select
              className="w-full border border-gray-300 p-2 rounded-md  focus:outline-none"
              defaultValue={""}
              onChange={(e) =>
                setFormData((val) => ({ ...val, designation: e.target.value }))
              }
            >
              <option value={""} disabled>
                Designation
              </option>
              <option value="Voice Support">Voice Support</option>
              <option value="Customer Support">Customer Support</option>
              <option value="Admin">Admin</option>
              <option value="Data Analyst">Data Analyst</option>
              <option value="des2">des2</option>
              <option value="des3">des3</option>
            </select>
          </div>
          <div>
            <label className="text-sm block font-semibold ">PAN</label>
            <input
              type="text"
              name="PAN"
              className="w-full border border-gray-300 p-2 rounded-md  focus:outline-none"
              placeholder="PAN"
              onChange={(e) =>
                setFormData((val) => ({ ...val, pan: e.target.value }))
              }
            />
          </div>
          <div className="flex justify-between items-center">
            <div>Daily Wage?</div>
            <div>
              <label className="relative inline-block w-14 h-7">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  onChange={(e) =>
                    setFormData((val) => ({
                      ...val,
                      isdailywages: e.target.checked,
                    }))
                  }
                />
                <span className="absolute cursor-pointer inset-0 bg-[#9fccfa] rounded-full transition-all duration-400 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] peer-focus:ring-2 peer-focus:ring-[#0974f1] peer-checked:bg-[#0974f1]"></span>
                <span className="absolute top-0 left-0  h-7 w-7 bg-white rounded-full shadow-[0_10px_20px_rgba(0,0,0,0.4)] transition-all duration-400 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] flex items-center justify-center peer-checked:translate-x-[1.6em]"></span>
              </label>
            </div>
          </div>
          <div>
            <label className="text-sm block font-semibold ">
              Payment Details
            </label>
            <input
              type="text"
              name="PaymentDetails"
              className="w-full border border-gray-300 p-2 rounded-md  focus:outline-none"
              placeholder="PaymentDetails"
              onChange={(e) =>
                setFormData((val) => ({
                  ...val,
                  paymentdetails: e.target.value,
                }))
              }
            />
          </div>

          <div className="">
            <button
              type="submit"
              className="w-full bg-purple-500 text-white p-2 rounded-md mt-4"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateStaff;
