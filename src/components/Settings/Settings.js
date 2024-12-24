import React, { useState, useEffect } from "react";
import { db, storage } from "../../firebase";
import { collection, addDoc, updateDoc, doc, getDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useSelector, useDispatch } from "react-redux";
import SettingsView from "./SettingView";
import { updateCompanyDetails } from "../../store/UserSlice";
const Settings = () => {
  const userDetails = useSelector((state) => state.users);
  const dispatch = useDispatch();

  const companyId =
    userDetails.companies[userDetails.selectedCompanyIndex].companyId;
  const [formData, setFormData] = useState({
    userName: "",
    name: "",
    phone: "",
    email: "",
    altContact: "",
    website: "",
    panNumber: "",
    companyLogo: "",
    gst: "",
    tagline: "",
    address: "",
    city: "",
    zipCode: "",
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

    if (name === "phone" || name === "altContact") {
      if (!/^\d{0,10}$/.test(value)) {
        return;
      }
    }

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
      const { id, ...payload } = formData;
      const { companyLogo, altContact, website, userName, userRef, ...rest } =
        payload;
      console.log("rest", rest);
      await updateDoc(doc(db, "companies", companyId), payload);
      alert("Details saved successfully! ");
      dispatch(updateCompanyDetails(rest));
    } catch (e) {
      console.error("Error adding document: ", e);
      alert("Failed to save details.");
    }
  };

  return (
    <div className="flex">
      <div className="w-1/4">
        {" "}
        <SettingsView />
      </div>
      <div className="p-6 bg-gray-100 w-full  max-h-screen overflow-y-auto mt-4">
        <div className="mx-auto bg-white shadow-md rounded-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-700">
              Company Details
            </h1>
          </div>

          <div className="flex items-center space-x-4 mb-6">
            <div className="w-36 h-36 bg-gray-200 border border-dashed border-gray-400 flex items-center justify-center rounded relative hover:border-blue-500">
              {formData.companyLogo ? (
                <img
                  src={formData.companyLogo}
                  alt="Profile"
                  className="w-36 h-36 bg-gray-200 border border-dashed border-gray-400 flex items-center justify-center rounded relative object-cover"
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
              {/* <div>
                <label className="block text-sm font-medium text-gray-600">
                  User Name:
                </label>
                <input
                  type="text"
                  name="userName"
                  value={formData.userName}
                  onChange={handleChange}
                  className="bg-gray-40 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 block w-full p-2  hover:border-blue-500 hover:shadow-md hover:shadow-blue-300"
                  placeholder="User Name"
                />
              </div> */}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Company Name:
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="bg-gray-40 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 block w-full p-2  hover:border-blue-500 hover:shadow-md hover:shadow-blue-300"
                placeholder="YOUR BUSINESS NAME"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">
                Company Phone:
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="bg-gray-40 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 block w-full p-2  hover:border-blue-500 hover:shadow-md hover:shadow-blue-300"
                placeholder="phone number..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Tagline:
              </label>
              <textarea
                type="text"
                name="tagline"
                value={formData.tagline}
                onChange={handleChange}
                className="bg-gray-40 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 block w-full p-2  hover:border-blue-500 hover:shadow-md hover:shadow-blue-300"
                placeholder="Enter your tagline..."
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Company Email:
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="bg-gray-40 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 block w-full p-2  hover:border-blue-500 hover:shadow-md hover:shadow-blue-300"
                placeholder="Company Email Address"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Alternative Contact Number:
              </label>
              <input
                type="text"
                name="altContact"
                value={formData.altContact}
                onChange={handleChange}
                className="bg-gray-40 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 block w-full p-2  hover:border-blue-500 hover:shadow-md hover:shadow-blue-300"
                placeholder="Alternate contact number"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Address:
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="bg-gray-40 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 block w-full p-2  hover:border-blue-500 hover:shadow-md hover:shadow-blue-300"
                placeholder="Address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">
                PIN Code:
              </label>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                className="bg-gray-40 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 block w-full p-2  hover:border-blue-500 hover:shadow-md hover:shadow-blue-300"
                placeholder="PIN Code"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4  mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-600">
                City:
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="bg-gray-40 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 block w-full p-2  hover:border-blue-500 hover:shadow-md hover:shadow-blue-300"
                placeholder="City"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Website:
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="bg-gray-40 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 block w-full p-2  hover:border-blue-500 hover:shadow-md hover:shadow-blue-300"
                placeholder="Website"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">
                GST:
              </label>
              <input
                type="text"
                name="gst"
                value={formData.gst}
                onChange={handleChange}
                className="bg-gray-40 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:outline-none focus:ring-blue-500 focus:border-blue-500 block w-full p-2  hover:border-blue-500 hover:shadow-md hover:shadow-blue-300"
                placeholder="GST"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                PAN Number:
              </label>
              <input
                type="text"
                name="panNumber"
                value={formData.panNumber}
                onChange={handleChange}
                className="bg-gray-40 border border-gray-300 text-gray-900 text-sm rounded-lg  focus:outline-none focus:outline-none focus:ring-blue-500 focus:border-blue-500 block w-full p-2  hover:border-blue-500 hover:shadow-md hover:shadow-blue-300"
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
    </div>
  );
};

export default Settings;
