import React, { useEffect, useState } from "react";
import { collection, doc, getDocs, query, where } from "firebase/firestore";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { Link } from "react-router-dom";
import { db } from "../../../firebase";
import { useSelector } from "react-redux";

const WeekOff = () => {
  const [weekPreference, setWeekPreference] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState("Staff Level");
  const [selectedStaff, setSelectedStaff] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [selectedDays, setSelectedDays] = useState({});
  const [expandedStaff, setExpandedStaff] = useState({});

  const weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const userDetails = useSelector((state) => state.users);
  const companyId =
    userDetails.companies[userDetails.selectedCompanyIndex].companyId;

  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        const companyRef = doc(db, "companies", companyId);
        const staffQuery = query(
          collection(db, "staff"),
          where("companyRef", "==", companyRef)
        );
        const staffSnapshot = await getDocs(staffQuery);
        const staffData = staffSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setStaffList(staffData);
      } catch (error) {
        console.error("Error fetching staff data:", error);
      }
    };

    fetchStaffData();
  }, [companyId]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <header className="flex justify-between items-center my-2">
        <div className="flex items-center space-x-3">
          <Link
            to="/staff-payout"
            className="flex items-center  text-gray-700 py-1 px-4 rounded-full hover:  transition duration-200"
          >
            <AiOutlineArrowLeft className="w-5 h-5 mr-2" />
          </Link>
          <h1 className="text-2xl font-bold">Week Off Preferences</h1>
        </div>
      </header>

      <div>
        <h3 className="text-lg font-medium mt-6 mb-4">
          Choose Week Off Calculation
        </h3>
        <select
          className="block w-full py-2 px-3 border bg-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          onChange={(e) => setSelectedOption(e.target.value)}
        >
          <option value="Calendar Month">Calendar Month</option>
          <option value="Exclude Week Offs">Exclude Week Offs</option>
        </select>
      </div>

      <div className="flex gap-4 my-3">
        {["Staff Level", "Business Level"].map((level) => (
          <button
            key={level}
            className={`px-4 py-2 rounded-lg font-medium ${
              selectedLevel === level
                ? "bg-green-500 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => setSelectedLevel(level)}
          >
            {level}
          </button>
        ))}
      </div>

      {selectedLevel === "Staff Level" && (
        <div>
          <h3 className="text-lg font-bold mb-4">Staff Members</h3>
          <div className="space-y-2">
            {staffList.map((staff) => (
              <div
                key={staff.id}
                className="p-3 bg-white border rounded-lg shadow-sm hover:bg-gray-100 cursor-pointer"
                onClick={() => {}}
              >
                {staff.name}
                <div>
                  {!expandedStaff[staff.id] && (
                    <div className="space-x-2 flex justify-between border-t-2 pt-2">
                      {weekDays.map((day) => (
                        <div
                          key={day}
                          className="flex w-full items-center justify-center p-3 bg-white border-2 rounded-lg shadow hover:bg-gray-100"
                        >
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                          />
                          <label className="ml-2">{day}</label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedLevel === "Business Level" && (
        <div>
          <h3 className="text-lg font-bold mb-4">Select Week Days</h3>
          <div className=" space-x-2 flex justify-between">
            {weekDays.map((day) => (
              <div
                key={day}
                className="flex w-full items-center p-3 bg-white border rounded-lg shadow-sm hover:bg-gray-100"
              >
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm">{day}</label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeekOff;
