import { addDoc, collection, Timestamp } from "firebase/firestore";
import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { db } from "../../../firebase";
import { useSelector } from "react-redux";

function CreateBookSidebar({ onClose, isOpen, refresh }) {
  const userDetails = useSelector((state) => state.users);

  const companyId =
    userDetails.companies[userDetails.selectedCompanyIndex].companyId;

  const [formData, setFormData] = useState({
    bankAccountDetails: {
      bank_account: "",
      bank_ifsc_code: "",
      bank_name: "",
      branch_name: "",
      confirm_bank_account: "",
    },
    createdAt: "",
    name: "",
    openingBalance: 0,
    upi: "",
  });
  function resetForm() {
    setFormData({
      bankAccountDetails: {
        bank_account: "",
        bank_ifsc_code: "",
        bank_name: "",
        branch_name: "",
        confirm_bank_account: "",
      },
      createdAt: "",
      name: "",
      openingBalance: 0,
      upi: "",
    });
  }
  async function onCreateAccount() {
    try {
      const payload = {
        ...formData,
        createdAt: Timestamp.fromDate(new Date()),
      };
      await addDoc(collection(db, "companies", companyId, "books"), payload);
      alert("successfully created Account");
      resetForm();
      refresh();
      onClose();
    } catch (error) {
      console.log("🚀 ~ onCreateAccount ~ error:", error);
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
        <div className="flex justify-between">
          <h2 className="font-bold text-xl mb-4"> Select Products</h2>
          <button className="text-2xl mb-4" onClick={onClose}>
            <IoMdClose size={24} />
          </button>
        </div>
        <div>
          <div>
            <label className="block font-semibold">Book Name</label>
            <input
              type="text"
              className="w-full border border-gray-300 p-2 rounded-md"
              placeholder="Book Name"
              required
              onChange={(e) =>
                setFormData((val) => ({ ...val, name: e.target.value }))
              }
            />
          </div>
          <div>
            <label className="block font-semibold">Opening Balance</label>
            <input
              type="text"
              className="w-full border border-gray-300 p-2 rounded-md"
              placeholder="Opening Balance"
              required
              onChange={(e) =>
                setFormData((val) => ({
                  ...val,
                  openingBalance: +e.target.value,
                }))
              }
            />
          </div>
          <div>
            <label className="block font-semibold">Bank Name</label>
            <input
              type="text"
              className="w-full border border-gray-300 p-2 rounded-md"
              placeholder="Bank Name"
              required
              onChange={(e) =>
                setFormData((val) => ({
                  ...val,
                  bankAccountDetails: {
                    ...formData.bankAccountDetails,
                    bank_name: e.target.value,
                  },
                }))
              }
            />
          </div>
          <div>
            <label className="block font-semibold">Bank Account</label>
            <input
              type="text"
              className="w-full border border-gray-300 p-2 rounded-md"
              placeholder="Bank Account"
              required
              onChange={(e) =>
                setFormData((val) => ({
                  ...val,
                  bankAccountDetails: {
                    ...formData.bankAccountDetails,
                    bank_account: e.target.value,
                  },
                }))
              }
            />
          </div>
          <div>
            <label className="block font-semibold">Confirm Bank Account</label>
            <input
              type="text"
              className="w-full border border-gray-300 p-2 rounded-md"
              placeholder="Confirm Bank Account"
              required
              onChange={(e) =>
                setFormData((val) => ({
                  ...val,
                  bankAccountDetails: {
                    ...formData.bankAccountDetails,
                    confirm_bank_account: e.target.value,
                  },
                }))
              }
            />
          </div>
          <div>
            <label className="block font-semibold">Bank IFSC Code</label>
            <input
              type="text"
              className="w-full border border-gray-300 p-2 rounded-md"
              placeholder="Bank IFSC Code"
              required
              onChange={(e) =>
                setFormData((val) => ({
                  ...val,
                  bankAccountDetails: {
                    ...formData.bankAccountDetails,
                    bank_ifsc_code: e.target.value,
                  },
                }))
              }
            />
          </div>
          <div>
            <label className="block font-semibold">Branch Name</label>
            <input
              type="text"
              className="w-full border border-gray-300 p-2 rounded-md"
              placeholder="Branch Name"
              required
              onChange={(e) =>
                setFormData((val) => ({
                  ...val,
                  bankAccountDetails: {
                    ...formData.bankAccountDetails,
                    branch_name: e.target.value,
                  },
                }))
              }
            />
          </div>
          <div>
            <label className="block font-semibold">
              UPI Details (Optional)
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 p-2 rounded-md"
              placeholder="UPI"
              required
              onChange={(e) =>
                setFormData((val) => ({
                  ...val,
                  upi: e.target.value,
                }))
              }
            />
          </div>
        </div>

        <button
          className="mt-4 bg-green-500 text-white py-2 px-4 rounded w-full"
          onClick={onCreateAccount}
        >
          Add Account
        </button>
      </div>
    </div>
  );
}

export default CreateBookSidebar;
