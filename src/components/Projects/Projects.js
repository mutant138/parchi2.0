import { collection, doc, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import { IoSearch } from "react-icons/io5";
function Projects() {
  const userDetails = useSelector((state) => state.users);
  const [filterStatus, setFilterStatus] = useState("All");
  const [loading, setLoading] = useState(!true);
  const [projectsList, setProjectsList] = useState([]);
  const [modifiedProjectsList, setModifiedProjectsList] = useState([]);
  const [projectCount, setProjectCount] = useState({
    onGoing: 0,
    completed: 0,
    delay: 0,
    total: 0,
  });
  // const [filterDate, setFilterDate] = useState({ from: "", to: "" });

  const navigate = useNavigate();
  useEffect(() => {
    async function fetchProjectsList() {
      try {
        const companyRef = doc(
          db,
          "companies",
          userDetails?.companies[userDetails.selectedCompanyIndex]?.companyId
        );

        const projectRef = collection(db, "projects");

        const q = query(
          projectRef,
          where("companyReferance", "==", companyRef)
        );
        const querySnapshot = await getDocs(q);
        const projectsData = querySnapshot.docs.map((doc) => {
          const { projectMembers, companyReferance, createdAt, ...rest } =
            doc.data();
          return {
            ...rest,
            projectId: doc.id,
            companyReferance: companyReferance.id,
            createdAt: DateFormate(createdAt),
            startDate: DateFormate(rest.startDate),
            dueDate: DateFormate(rest.dueDate),
            vendorRef: rest?.vendorRef?.map((ref) => ref.id),
            customerRef: rest?.customerRef?.map((ref) => ref.id),
            staffRef: rest?.staffRef?.map((ref) => ref.id),
          };
        });

        setProjectsList(projectsData);
        setModifiedProjectsList(projectsData);
        let onGoing = 0;
        let delay = 0;
        let completed = 0;
        for (const project of projectsData) {
          if (project.status === "On-Going") {
            ++onGoing;
          } else if (project.status === "Delay") {
            ++delay;
          } else {
            ++completed;
          }
        }
        setProjectCount({
          onGoing,
          completed,
          delay,
          total: projectsData.length,
        });
      } catch (error) {
        console.error("Error fetching invoices:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProjectsList();
  }, [userDetails.companies]);

  function DateFormate(timestamp) {
    const milliseconds =
      timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000;
    const date = new Date(milliseconds);
    const getDate = String(date.getDate()).padStart(2, "0");
    const getMonth = String(date.getMonth() + 1).padStart(2, "0");
    const getFullYear = date.getFullYear();

    return `${getDate}/${getMonth}/${getFullYear}`;
  }

  function isDueDateEnd(timestamp) {
    const timestampDate = new Date(timestamp);

    const currentDate = new Date();
    return timestampDate < currentDate;
  }

  const [searchInput, setSearchInput] = useState("");

  function onSearchFilter(e) {
    setSearchInput(e.target.value);
  }

  // function onDateChange(e) {
  //   const { name, value } = e.target;
  //   setFilterDate((prev) => ({ ...prev, [name]: value }));
  // }

  // function resetDateFilter() {
  //   setFilterDate({ from: "", to: "" });
  // }

  useEffect(() => {
    function onFilterFun() {
      const filterData = projectsList.filter((ele) => {
        const { name, status, startDate, dueDate } = ele;
        const matchesSearch = name
          .toLowerCase()
          .includes(searchInput.toLowerCase());
        const matchesStatus = filterStatus === "All" || status === filterStatus;
        // const projectStartDate = new Date(startDate.seconds * 1000);
        // const projectDueDate = new Date(dueDate.seconds * 1000);

        // const matchesDateRange =
        //   (filterDate.from === "" ||
        //     projectStartDate >= new Date(filterDate.from)) &&
        //   (filterDate.to === "" || projectDueDate <= new Date(filterDate.to));
        return matchesSearch && matchesStatus;
      });
      setModifiedProjectsList(filterData);
    }
    onFilterFun();
  }, [filterStatus, searchInput, projectsList]);

  function onViewProject(project) {
    const { projectId } = project;
    navigate(projectId);
  }

  return (
    <div className="w-full" style={{ width: "100%", height: "92vh" }}>
      <div
        className="px-8 pb-8 pt-5 bg-gray-100 overflow-y-auto"
        style={{ width: "100%", height: "92vh" }}
      >
        <header className="flex items-center justify-between mb-3">
          <h1 className="text-2xl font-bold">Projects</h1>
          <Link
            className="bg-blue-500 text-white py-1 px-2 rounded"
            to="create-Project"
          >
            + Create Project
          </Link>
        </header>
        <div className="bg-white  rounded-lg shadow mb-4">
          <div className="flex justify-between text-center p-4">
            <div className="border-r-2 w-full">
              <div>On-Going</div>
              <div>{projectCount.onGoing}</div>
            </div>
            <div className="border-r-2 w-full">
              <div>Delay</div>
              <div>{projectCount.delay}</div>
            </div>
            <div className=" w-full">
              <div>Completed</div>
              <div>{projectCount.completed}</div>
            </div>
          </div>
          <div className="flex justify-between bg-green-500  text-center p-2 px-5 rounded-b-lg">
            <div>All projects</div>
            <div>{projectCount.total}</div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow mb-4">
          <nav className="flex space-x-4 mb-4">
            <button
              onClick={() => setFilterStatus("All")}
              className={`font-semibold ${
                filterStatus === "All" ? "text-blue-500" : "text-gray-500"
              }`}
            >
              All Projects
            </button>
            <button
              onClick={() => setFilterStatus("On-Going")}
              className={`${
                filterStatus === "On-Going"
                  ? "text-blue-500 font-semibold"
                  : "text-gray-500"
              }`}
            >
              On-Going
            </button>
            <button
              onClick={() => setFilterStatus("Delay")}
              className={`${
                filterStatus === "Delay"
                  ? "text-blue-500 font-semibold"
                  : "text-gray-500"
              }`}
            >
              Delay
            </button>
            <button
              onClick={() => setFilterStatus("Completed")}
              className={`${
                filterStatus === "Completed"
                  ? "text-blue-500 font-semibold"
                  : "text-gray-500"
              }`}
            >
              Completed
            </button>
          </nav>
          <div className="flex items-center space-x-4 mb-4 border p-2 rounded">
            <input
              type="text"
              placeholder="Search by Project Name #..."
              className=" w-full focus:outline-none"
              // value={searchTerm}
              onChange={onSearchFilter}
            />
            <IoSearch />
            {/* <input
              type="date"
              name="from"
              value={filterDate.from}
              onChange={onDateChange}
              className="border p-2 rounded"
            />
            <span>-</span>
            <input
              type="date"
              name="to"
              value={filterDate.to}
              onChange={onDateChange}
              className="border p-2 rounded"
            />
            <button
              onClick={resetDateFilter}
              className="bg-blue-500 text-white  p-2 rounded"
            >
              Reset
            </button> */}
          </div>

          {loading ? (
            <div className="text-center py-6">Loading Projects...</div>
          ) : (
            <div className="overflow-y-auto h-96 ">
              <div className="">
                {modifiedProjectsList.length > 0 ? (
                  modifiedProjectsList.map((item) => (
                    <div
                      className={`border-2 shadow cursor-pointer rounded-lg p-3 mt-3 ${
                        isDueDateEnd(item.dueDate) ? "bg-red-400" : " "
                      }`}
                      onClick={() => onViewProject(item)}
                      key={item.projectId}
                    >
                      <div className="flex justify-between mb-2">
                        <div className="font-bold">{item.name}</div>
                        <div>
                          <span>By</span> {userDetails.name}
                        </div>
                      </div>
                      <div className="flex justify-between mb-2">
                        <div>
                          <span className="text-gray-700">Start Date : </span>
                          <span>{item.startDate}</span>

                          <span className="text-gray-700 ml-4">
                            End Date :{" "}
                          </span>
                          <span>{item.dueDate}</span>
                        </div>
                        <div
                          className={
                            item.status === "Delay"
                              ? "text-rose-800"
                              : item.status === "Completed"
                              ? "text-green-700"
                              : ""
                          }
                        >
                          {item.status}
                        </div>
                      </div>
                      {isDueDateEnd(item.dueDate) && (
                        <div className="text-xs">
                          <i>Project due time over kindly check it</i>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center">No Project Found</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Projects;
