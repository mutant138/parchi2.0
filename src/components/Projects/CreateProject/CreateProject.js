import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { addDoc, collection, doc, Timestamp } from "firebase/firestore";
import { db } from "../../../firebase";

function CreateProject() {
  const userDetails = useSelector((state) => state.users);

  const companyDetails =
    userDetails.companies[userDetails.selectedCompanyIndex];
  const navigate = useNavigate();

  const [projectForm, setProjectForm] = useState({
    status: "On-Going",
    location: "",
    description: "",
    name: "",
    dueDate: "",
    startDate: "",
  });
  const [isMoreChecked, setIsMoreChecked] = useState(false);
  async function onCreateProject() {
    if (!projectForm.name) {
      return;
    }
    try {
      const companyRef = await doc(db, "companies", companyDetails.companyId);
      const payload = {
        ...projectForm,
        companyRef: companyRef,
        createdAt: Timestamp.fromDate(new Date()),
      };
      await addDoc(collection(db, "projects"), payload);
      alert("Successfully Created the Project");
      navigate("/projects");
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div
      className="p-5 pt-3 bg-gray-100"
      style={{ width: "100%", height: "92vh" }}
    >
      <header className="items-center my-2">
        <div className="flex space-x-3">
          <Link
            className="flex items-center bg-gray-300 text-gray-700 py-1 px-4 rounded-full transform hover:bg-gray-400 hover:text-white transition duration-200 ease-in-out"
            to="/projects"
          >
            <AiOutlineArrowLeft className="w-5 h-5 mr-2" />
          </Link>{" "}
          <h1 className="text-2xl font-bold">Create Project</h1>
        </div>
      </header>
      <div className="p-6">
        <div className="bg-white p-4 rounded-lg">
          <div className="">
            <label className="text-lg text-gray-600">
              Project Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter Project Name"
              className="text-base text-gray-900 font-semibold border p-1 rounded w-full mt-1"
              onChange={(e) =>
                setProjectForm((val) => ({ ...val, name: e.target.value }))
              }
              required
            />
          </div>
          <div className="my-5">
            <h2 className="mb-2">Timelines</h2>
            <div className="grid grid-cols-2 gap-4 rounded-lg">
              <div>
                <label className="text-gray-600">Start Date</label>
                <input
                  type="date"
                  className="border p-1 rounded w-full mt-1"
                  onChange={(e) =>
                    setProjectForm((val) => ({
                      ...val,
                      startDate: Timestamp.fromDate(new Date(e.target.value)),
                    }))
                  }
                />
              </div>
              <div>
                <label className=" text-gray-600">Due Date</label>
                <input
                  type="date"
                  className="border p-1 rounded w-full mt-1"
                  onChange={(e) =>
                    setProjectForm((val) => ({
                      ...val,
                      dueDate: Timestamp.fromDate(new Date(e.target.value)),
                    }))
                  }
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center my-4">
          <div>More Details</div>
          <div>
            <label className="relative inline-block w-14 h-8">
              <input
                type="checkbox"
                className="sr-only peer"
                defaultChecked={isMoreChecked}
                onChange={(e) => {
                  setIsMoreChecked(e.target.checked);
                }}
              />
              <span className="absolute cursor-pointer inset-0 bg-[#9fccfa] rounded-full transition-all duration-400 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] peer-focus:ring-2 peer-focus:ring-[#0974f1] peer-checked:bg-[#0974f1]"></span>
              <span className="absolute top-0 left-0 h-8 w-8 bg-white rounded-full shadow-[0_10px_20px_rgba(0,0,0,0.4)] transition-all duration-400 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] flex items-center justify-center peer-checked:translate-x-[1.6em]"></span>
            </label>
          </div>
        </div>
        {isMoreChecked && (
          <div className="bg-white p-4 rounded-lg">
            <div className="">
              <label className="text-lg text-gray-600">Bank/Book Details</label>
              <div>
                <input
                  type="text"
                  placeholder="Enter Bank/Book Details"
                  className="text-base text-gray-900 font-semibold border p-1 rounded w-full mt-1"
                />
              </div>
            </div>
            <div className="">
              <label className="text-lg text-gray-600">Location</label>
              <input
                type="text"
                placeholder="Enter Location"
                className="text-base text-gray-900 font-semibold border p-1 rounded w-full mt-1"
                onChange={(e) =>
                  setProjectForm((val) => ({
                    ...val,
                    location: e.target.value,
                  }))
                }
              />
            </div>
            <div className="my-5">
              <label className="text-lg text-gray-600">Description</label>
              <input
                type="text"
                placeholder="Enter Description"
                className="text-base text-gray-900 font-semibold border p-1 rounded w-full mt-1"
                onChange={(e) =>
                  setProjectForm((val) => ({
                    ...val,
                    description: e.target.value,
                  }))
                }
              />
            </div>
          </div>
        )}
        <div className="mt-6 flex justify-end">
          <div className="flex gap-2">
            <button
              className="bg-blue-500 text-white py-1 px-4 rounded-lg flex items-center gap-1"
              onClick={onCreateProject}
            >
              <span className="text-lg">+</span> Create Project
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default CreateProject;
