import React, { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import {
  addDoc,
  collection,
  serverTimestamp,
  doc,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../../firebase";
import { useSelector } from "react-redux";
import { FaUserEdit } from "react-icons/fa";

const NewVendorModal = ({ isOpen, onClose, onVedorAdded, vendorData }) => {
  const userDetails = useSelector((state) => state.users);

  const companyId =
    userDetails.companies[userDetails.selectedCompanyIndex].companyId;
  const [isUploading, setIsUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [fileName, setFileName] = useState("No file chosen");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    profileImage: "",
    address: "",
    city: "",
    zipCode: "",
    gstNumber: "",
    panNumber: "",
  });

  useEffect(() => {
    if (vendorData) {
      setFormData({
        name: vendorData.name || "",
        phone: vendorData.phone || "",
        email: vendorData.email || "",
        profileImage: vendorData.profileImage || "",
        address: vendorData.address || "",
        city: vendorData.city || "",
        zipCode: vendorData.zipCode || "",
        gstNumber: vendorData.gstNumber || "",
        panNumber: vendorData.panNumber || "",
      });
      setIsEditing(false);
    } else {
      setFormData({
        name: "",
        phone: "",
        email: "",
        profileImage: "",
        address: "",
        city: "",
        zipCode: "",
        gstNumber: "",
        panNumber: "",
      });
      setIsEditing(true);
    }
  }, [vendorData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      if (!/^\d{0,10}$/.test(value)) {
        return;
      }
    }

    // if (name.includes(".")) {
    //   const [group, key] = name.split(".");
    //   setFormData((prevState) => ({
    //     ...prevState,
    //     [group]: {
    //       ...prevState[group],
    //       [key]: value,
    //     },
    //   }));
    // } else {
    setFormData({ ...formData, [name]: value });
    // }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploading(true);
      setFileName(file.name);
      try {
        const storageRef = ref(storage, `profileImages/${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        setFormData((prevData) => ({
          ...prevData,
          profileImage: downloadURL,
        }));
        setIsUploading(false);
      } catch (error) {
        console.error("Error uploading file:", error);
        setIsUploading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (vendorData?.id) {
        const vendorDocRef = doc(db, "vendors", vendorData.id);
        await updateDoc(vendorDocRef, formData);
      } else {
        await addDoc(collection(db, "vendors"), {
          ...formData,
          companyRef: doc(db, "companies", companyId),
          createdAt: serverTimestamp(),
        });
      }
      setFileName("No file chosen");
      onClose();
      onVedorAdded();
    } catch (error) {
      console.error("Error saving vendor:", error);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex justify-end bg-black bg-opacity-25 transition-opacity ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={onClose}
    >
      <div
        className={`bg-white w-[370px] p-6 transform transition-transform overflow-y-auto ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ maxHeight: "100vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-4">
          {vendorData ? "Edit Vendor" : "New Vendor"}
        </h2>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
        >
          <IoMdClose size={24} />
        </button>

        {vendorData && !isEditing && (
          <div className="space-y-4">
            <div className="flex flex-col items-center space-y-3">
              {vendorData.profileImage ? (
                <img
                  src={formData.profileImage}
                  alt="Profile"
                  className="mt-2 w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <span className="bg-purple-500 text-white rounded-full size-20 flex items-center justify-center font-semibold text-4xl">
                  {vendorData.name.charAt(0)}
                </span>
              )}
              <button
                className="flex items-center space-x-1 text-gray-600 hover:text-black"
                onClick={() => setIsEditing(true)}
              >
                <FaUserEdit />

                <span className="font-semibold">Edit</span>
              </button>
            </div>
            <div className="p-4">
              <p className="text-gray-800 flex justify-between mb-3">
                <strong className="text-grey-500 font-bold">Name: </strong>

                <span className="text-gray-500 font-semibold">
                  {vendorData.name ? vendorData.name : " - "}
                </span>
              </p>
              <p className="text-gray-800 flex justify-between mb-3">
                <strong className="text-grey-500 font-bold">Phone:</strong>
                <span className="text-gray-500 font-semibold">
                  {vendorData.phone ? vendorData.phone : " - "}
                </span>
              </p>
              <p className="text-gray-800 flex justify-between mb-3">
                <strong className="text-grey-500 font-bold">Email:</strong>
                <span className="text-gray-500 font-semibold">
                  {vendorData.email ? vendorData.email : " - "}
                </span>
              </p>
              <p className="text-gray-800 flex justify-between mb-3">
                <strong className="text-grey-500 font-bold">Address:</strong>{" "}
                {vendorData.length > 0 ? (
                  <span className="text-gray-500 font-semibold">
                    {vendorData.address || "  "} -{vendorData.city || "  "} -
                    {vendorData.zipCode || " "}
                  </span>
                ) : (
                  " - "
                )}
              </p>
              <p className="text-gray-800 flex justify-between mb-3">
                <strong className="text-grey-500 font-bold">GST:</strong>{" "}
                <span className="text-gray-500 font-semibold">
                  {vendorData.gstNumber || " - "}
                </span>
              </p>
              <p className="text-gray-800 flex justify-between mb-3">
                <strong className="text-grey-500 font-bold">PAN:</strong>{" "}
                <span className="text-gray-500 font-semibold">
                  {vendorData.panNumber || " - "}
                </span>
              </p>
            </div>
          </div>
        )}

        {isEditing && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {vendorData && (
              <>
                <div className="flex flex-col items-center space-y-3">
                  {formData.profileImage ? (
                    <img
                      src={formData.profileImage}
                      alt="Profile"
                      className="mt-2 w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <span className="bg-purple-500 text-white rounded-full size-20 flex items-center justify-center font-semibold text-4xl">
                      {vendorData.name.charAt(0)}
                    </span>
                  )}
                  <button
                    className="flex items-center space-x-1 text-gray-600 hover:text-black"
                    onClick={() => setIsEditing(true)}
                  >
                    <FaUserEdit />

                    <span className="font-semibold">Edit</span>
                  </button>
                </div>
                <div className="flex flex-col w-full max-w-sm mx-auto mt-10">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Profile Image
                  </label>
                  <div className="border border-gray-300 rounded-md px-3 py-2 flex items-center">
                    <label
                      htmlFor="profile-image"
                      className="text-sm text-gray-500 cursor-pointer"
                    >
                      Choose File
                    </label>
                    <input
                      type="file"
                      id="profile-image"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <span id="file-name" className="text-sm text-gray-400 ml-2">
                      {fileName}
                    </span>
                  </div>
                  {isUploading && (
                    <p className="text-sm text-blue-500 mt-2">Uploading...</p>
                  )}
                </div>
              </>
            )}

            <div>
              <label className="block font-semibold">*Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-md"
                placeholder="Name"
                required
              />
            </div>
            <div>
              <label className="block font-semibold">*Phone</label>
              <div className="flex items-center">
                <span className="px-2 py-2 border border-gray-300 rounded-l-md">
                  +91
                </span>
                <input
                  type="text"
                  maxLength="10"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded-r-md"
                  placeholder="Phone"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block font-semibold">Email ID</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-md"
                placeholder="Email ID"
              />
            </div>

            <div>
              <label className="block font-semibold">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-md"
                placeholder="Street Address"
              />
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                placeholder="Pin Code"
                className="w-1/2 border border-gray-300 p-2 rounded-md"
              />
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
                className="w-1/2 border border-gray-300 p-2 rounded-md"
              />
            </div>

            <div>
              <label className="block font-semibold">GST Number</label>
              <input
                type="text"
                name="gstNumber"
                value={formData.gstNumber}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-md"
                placeholder="GST Number"
              />
            </div>
            <div>
              <label className="block font-semibold">PAN Number</label>
              <input
                type="text"
                name="panNumber"
                value={formData.panNumber}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-md"
                placeholder="PAN Number"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-purple-500 text-white p-2 rounded-md mt-4"
            >
              {vendorData ? "Update Vendor" : "Add Vendor"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default NewVendorModal;
