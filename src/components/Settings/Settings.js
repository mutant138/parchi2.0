import React, { useState, useEffect } from "react";
import { db, storage } from "../../firebase";
import { collection, addDoc, updateDoc, doc, getDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useSelector } from "react-redux";
const Settings = () => {
  const userDetails = useSelector((state) => state.users);

  const companyId =
    userDetails.companies[userDetails.selectedCompanyIndex].companyId;
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    altContact: "",
    website: "",
    pan: "",
    companyLogo: "",
  });

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const companyDocRef = doc(db, "companies", companyId);
        const companySnapshot = await getDoc(companyDocRef);

        if (companySnapshot.exists()) {
          const companyData = {
            id: companySnapshot.id,
            ...companySnapshot.data(),
          };
          console.log("companyData", companyData);
          setFormData(companyData);
        } else {
          console.error("No such document!");
        }
      } catch (error) {
        console.error("Error fetching company:", error);
      }
    };

    fetchCompanyDetails();
  }, [companyId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileUpload = async (file) => {
    if (!file) return;

    try {
      const storageRef = ref(storage, `logos/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          console.error("Error uploading file:", error);
          alert("Failed to upload file.");
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setFormData((prevData) => ({
            ...prevData,
            companyLogo: downloadURL,
          }));
          alert("File uploaded successfully!");
        }
      );
    } catch (e) {
      console.error("Error during file upload:", e);
      alert("Failed to upload the file.");
    }
  };

  const handleSave = async () => {
    try {
      const docRef = await updateDoc(doc(db, "companies", companyId), formData);
      alert("Details saved successfully! Document ID: ");
    } catch (e) {
      console.error("Error adding document: ", e);
      alert("Failed to save details.");
    }
  };

  return (
    <div className="p-6 bg-gray-100 max-h-screen">
      <div className="max-w-10xl mx-auto bg-white shadow-md rounded-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-700">
            Company Details
          </h1>
        </div>

        <div className="flex items-center space-x-4 mb-10">
          <div className="w-24 h-24 bg-gray-200 border border-dashed border-gray-400 flex items-center justify-center rounded relative">
            {formData.companyLogo ? (
              <img
                src={formData.companyLogo}
                alt="Profile"
                className="w-24 h-24 bg-gray-200 border border-dashed border-gray-400 flex items-center justify-center rounded relative object-cover"
              />
            ) : (
              <label
                htmlFor="image-upload"
                className="absolute inset-0 flex items-center justify-center cursor-pointer text-gray-500 text-sm"
              >
                Upload
              </label>
            )}
            <input
              id="image-upload"
              type="file"
              className="absolute inset-0 opacity-0 cursor-pointer"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                handleFileUpload(file);
              }}
            />
          </div>

          <div className="flex-grow">
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Company Name:
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md pt-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="YOUR BUSINESS NAME"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-10">
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Company Phone:
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md pt-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="phone number..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Company Email:
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md pt-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Company Email Address"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 mb-10">
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Alternative Contact Number:
            </label>
            <input
              type="text"
              name="altContact"
              value={formData.altContact}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md pt-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Alternate contact number"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-10 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Website:
            </label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md pt-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Website"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              PAN Number:
            </label>
            <input
              type="text"
              name="pan"
              value={formData.pan}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md pt-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="PAN Number"
            />
          </div>
        </div>

        <div className="text-right">
          <button
            className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-500"
            onClick={handleSave}
          >
            Save & Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
