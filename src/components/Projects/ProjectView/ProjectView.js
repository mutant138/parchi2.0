import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MdDateRange } from "react-icons/md";
import { BsFolderPlus } from "react-icons/bs";
import { RiDeleteBin6Line, RiUserAddLine } from "react-icons/ri";
import { FaTasks } from "react-icons/fa";
import { IoWalletOutline } from "react-icons/io5";
import { HiOutlineShoppingCart } from "react-icons/hi2";
import { BsCalendar4 } from "react-icons/bs";
import { BsFileEarmarkCheck } from "react-icons/bs";
import { FaArrowUp } from "react-icons/fa";
import { FaArrowDown } from "react-icons/fa";
import { FaFilter } from "react-icons/fa6";
import {
  updateDoc,
  doc,
  getDoc,
  Timestamp,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../../firebase";
import { TiMessages } from "react-icons/ti";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { TbEdit } from "react-icons/tb";

function ProjectView() {
  const { id } = useParams();
  const [filter, setFilter] = useState("All");
  const [project, setProject] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || "",
        description: project.description || "",
        startDate: project.startDate,
        dueDate: project.dueDate,
      });
    }
  }, [project]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdate = async () => {
    const projectDoc = doc(db, "projects", id);

    const updatedData = {
      ...formData,
      startDate: formData.startDate
        ? Timestamp.fromDate(new Date(formData.startDate))
        : null,
      dueDate: formData.dueDate
        ? Timestamp.fromDate(new Date(formData.dueDate))
        : null,
    };

    try {
      await updateDoc(projectDoc, updatedData);
      alert("Project updated successfully!");
      setIsEdit(false);
      fetchData();
    } catch (error) {
      console.error("Error updating project:", error);
      alert("Failed to update the project.");
    }
  };
  function DateFormate(timestamp, format = "dd/mm/yyyy") {
    const milliseconds =
      timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000;
    const date = new Date(milliseconds);
    const getDate = String(date.getDate()).padStart(2, "0");
    const getMonth = String(date.getMonth() + 1).padStart(2, "0");
    const getFullYear = date.getFullYear();

    return format === "yyyy-mm-dd"
      ? `${getFullYear}-${getMonth}-${getDate}`
      : `${getDate}/${getMonth}/${getFullYear}`;
  }

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const getData = await getDoc(doc(db, "projects", id));
    const data = getData.data();
    const payload = {
      ...data,
      companyRef: data.companyRef.id,
      createdAt: DateFormate(data.createdAt),
      startDate: DateFormate(data.startDate, "yyyy-mm-dd"),
      dueDate: DateFormate(data.dueDate, "yyyy-mm-dd"),
      vendorRef: data?.vendorRef?.map((ref) => ref.id),
      customerRef: data?.customerRef?.map((ref) => ref.id),
      staffRef: data?.staffRef?.map((ref) => ref.id),
    };

    setProject(payload);
  }
  const manageProjectItems = [
    {
      name: "Users",
      icon: <RiUserAddLine />,
      onClick: () => navigate("user"),
    },
    {
      name: "Milestones",
      icon: <BsCalendar4 />,
      onClick: () => {
        navigate("milestones");
      },
    },
    {
      name: "Tasks",
      icon: <FaTasks />,
      onClick: () => {
        navigate("tasks");
      },
    },
    {
      name: "Files",
      icon: <BsFolderPlus />,
      onClick: () => {
        navigate("files");
      },
    },
    {
      name: "Approvals",
      icon: <BsFileEarmarkCheck />,
      onClick: () => {
        navigate("approvals");
      },
    },
    {
      name: "Chat",
      icon: <TiMessages />,
      onClick: () => {
        navigate("chats");
      },
    },
    { name: "Payments", icon: <IoWalletOutline /> },
    {
      name: "Items",
      icon: <HiOutlineShoppingCart />,
      onClick: () => {
        navigate("items");
      },
    },
  ];

  async function onChangeStatus(e) {
    try {
      const projectRef = await doc(db, "projects", project.projectId);
      await updateDoc(projectRef, {
        status: e.target.value,
      });
      alert("Successfully Updated Status");
    } catch (error) {
      console.log("🚀 ~ onChangeStatus ~ error:", error);
    }
  }
  async function handleDelete() {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this Project?"
      );
      if (!confirmDelete) return;
      await deleteDoc(doc(db, "projects", id));
      navigate("/projects");
    } catch (error) {
      console.log("🚀 ~ onHandleDeleteVendor ~ error:", error);
    }
  }
  return (
    <div className="w-full" style={{ width: "100%" }}>
      <div className="px-8 pb-8 pt-2 bg-gray-100" style={{ width: "100%" }}>
        <div className="flex justify-between mt-5">
          <div className="flex">
            <div className="mr-5">
              <Link
                className="flex items-center bg-gray-300 text-gray-700 py-1 px-4 rounded-full transform hover:bg-gray-400 hover:text-white transition duration-200 ease-in-out"
                to="/projects"
              >
                <AiOutlineArrowLeft className="w-5 h-5 mr-2" />
              </Link>
            </div>
            {!isEdit ? (
              <div className="flex items-center ">
                <MdDateRange size={30} className="text-gray-700" />
                <span className="text-gray-700">Start Date : </span>{" "}
                {project.startDate}
              </div>
            ) : (
              <div className="flex items-center">
                <MdDateRange size={30} className="text-gray-700" />
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      startDate: e.target.value,
                    }))
                  }
                  className="border px-2 py-1 rounded"
                />
              </div>
            )}

            {!isEdit ? (
              <div className="flex items-center mx-10">
                <MdDateRange size={30} className="text-gray-700" />{" "}
                <span className="text-gray-700">End Date : </span>{" "}
                {project.dueDate}
              </div>
            ) : (
              <div className="flex items-center mx-10">
                <MdDateRange size={30} className="text-gray-700" />
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      dueDate: e.target.value,
                    }))
                  }
                  className="border px-2 py-1 rounded"
                />
              </div>
            )}
          </div>
          <div>
            <select
              className="border-b-4 px-2 py-1 bg-transparent"
              onChange={onChangeStatus}
              defaultValue={project.status}
            >
              <option value="On-Going">On-Going</option>
              <option value="Delay">Delay</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        {!isEdit ? (
          <div className="bg-white p-4 rounded-lg shadow my-4">
            <div className="border-b pb-3 h-8">{project.name}</div>
            <div className="py-3">{project.description}</div>
          </div>
        ) : (
          <div className="bg-white p-4 rounded-lg shadow my-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="border w-full px-2 py-1 rounded"
            />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="border w-full px-2 py-1 rounded mt-3"
            />
          </div>
        )}

        <div className="grid justify-items-end">
          {!isEdit ? (
            <div className="flex space-x-3">
              <button
                className="px-4 py-1 bg-blue-500 text-white rounded-full flex items-center"
                onClick={() => setIsEdit(true)}
              >
                <TbEdit /> &nbsp; Edit
              </button>
              <button
                className="px-4 py-1 bg-red-500 text-white rounded-full flex items-center"
                onClick={handleDelete}
              >
                <RiDeleteBin6Line />
              </button>
            </div>
          ) : (
            <div>
              <button
                className="px-4 py-1 bg-green-500 text-white rounded-full"
                onClick={handleUpdate}
              >
                Save
              </button>
              <button
                className="px-4 py-1 bg-gray-500 text-white rounded-full ml-2"
                onClick={() => setIsEdit(false)}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
        <div className=" bg-white shadow rounded-lg mt-4">
          <div className="p-4">
            <div className="flex justify-between mb-2">
              <div className="flex justify-around text-gray-600">
                <button
                  className={
                    "px-4 py-1" +
                    (filter === "All" ? " bg-gray-300 rounded-full" : "")
                  }
                  onClick={() => setFilter("All")}
                >
                  All
                </button>
                <button
                  className={
                    "px-4 py-1" +
                    (filter === "Today" ? " bg-gray-300 rounded-full" : "")
                  }
                  onClick={() => setFilter("Today")}
                >
                  Today
                </button>
                <button
                  className={
                    "px-4 py-1" +
                    (filter === "Week" ? " bg-gray-300 rounded-full" : "")
                  }
                  onClick={() => setFilter("Week")}
                >
                  Week
                </button>
                <button
                  className={
                    "px-4 py-1" +
                    (filter === "Month" ? " bg-gray-300 rounded-full" : "")
                  }
                  onClick={() => setFilter("Month")}
                >
                  Month
                </button>
              </div>
              <FaFilter />
            </div>
            <div className="flex justify-between items-center mt-4">
              <div className="">
                <div className="flex items-center py-2">
                  <div className="text-green-500 p-3 bg-sky-100 rounded-lg">
                    <FaArrowDown />
                  </div>
                  <span className="font-bold ml-5">Income</span>
                </div>
                <div>2500</div>
              </div>
              <div className="">
                <div className="flex items-center py-2">
                  <span className=" font-bold mr-5">Expense</span>
                  <div className="text-red-500 p-3 bg-red-200 rounded-lg">
                    <FaArrowUp />
                  </div>
                </div>

                <div className="text-end">2500</div>
              </div>
            </div>
          </div>
          <div className="flex justify-between bg-green-500  text-center mt-4 p-2 rounded-b-lg">
            <div>Balance</div>
            <div>2500</div>
          </div>
        </div>
        <div className="p-5 bg-white shadow rounded-lg mt-4">
          <div className="mb-4">Manage Project</div>
          <div className="grid grid-cols-4 gap-4 gap-y-8">
            {manageProjectItems.map((item) => (
              <div
                key={item.name}
                className="flex flex-col items-center cursor-pointer"
                onClick={item.onClick}
              >
                <div className="text-3xl bg-gray-200 p-3 rounded-lg">
                  {item.icon}
                </div>
                <p className="text-sm text-center mt-1">{item.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectView;