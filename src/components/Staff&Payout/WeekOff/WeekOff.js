import { collection, doc, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
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
  async function fetchStaffData() {
    try {
      const companyRef = doc(db, "companies", companyId);

      const q = query(
        collection(db, "staff"),
        where("companyRef", "==", companyRef)
      );
      const getData = await getDocs(q);
      const staffData = getData.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStaffList(staffData);
    } catch (error) {
      console.log("🚀 ~ fetchStaffData ~ error:", error);
    }
  }

  useEffect(() => {
    fetchStaffData();
  }, []);
  const handleLevelChange = (level) => {
    setSelectedLevel(level);
  };

  const handleSelection = (item, selectionType) => {
    if (selectionType === "staff") {
      setSelectedStaff((prevSelected) =>
        prevSelected.includes(item)
          ? prevSelected.filter((m) => m !== item)
          : [...prevSelected, item]
      );
    } else if (selectionType === "day") {
      setSelectedDays({
        ...selectedDays,
        [item]: !selectedDays[item],
      });
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <header className="flex justify-between items-center space-x-3  my-2">
        <div className="flex space-x-3 justify-center">
          <Link
            className="flex items-center  rounded-full transform hover:bg-gray-400 hover:text-white transition duration-200 ease-in-out"
            to="/staff-payout"
          >
            <AiOutlineArrowLeft className="w-5 h-5 mr-2" />
          </Link>
          <h2 className="text-xl font-bold mb-4">Week Off Preferences</h2>
        </div>
      </header>
      {/* {!weekPreference && (
        <div>
          <h3 className="text-lg font-bold mb-4">Select Week Preference</h3>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600"
            onClick={() => setWeekPreference(true)}
          >
            Select Week Preferences
          </button>
        </div>
      )} */}
      <>
        {/* Calendar Month or Exclude Week Off Selection */}
        <div>
          <h3 className="text-lg font-bold mb-4">
            Choose Week Off Calculation
          </h3>
          <select
            className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setSelectedOption(e.target.value)}
          >
            <option value="Calendar Month">Calendar Month</option>
            <option value="Exclude Week Offs">Exclude Week Offs</option>
          </select>
        </div>
        <>
          {/* <div className="mb-4">
            <h4 className="font-medium text-blue-600">
              Selected: {selectedOption}
            </h4>
            <button
              className="text-sm text-red-500 underline"
              onClick={() => setSelectedOption(null)}
            >
              Change Week Off Calculation
            </button>
          </div> */}

          {/* Staff Level and Business Level Tabs */}
          <div className="flex gap-4 mb-6 mt-3">
            <button
              className={`px-4 py-2 rounded-lg font-medium ${
                selectedLevel === "Staff Level"
                  ? "bg-green-500 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => handleLevelChange("Staff Level")}
            >
              Staff Level
            </button>
            <button
              className={`px-4 py-2 rounded-lg font-medium ${
                selectedLevel === "Business Level"
                  ? "bg-green-500 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => handleLevelChange("Business Level")}
            >
              Business Level
            </button>
          </div>

          {/* Staff Level Content */}
          {selectedLevel === "Staff Level" && (
            <div>
              <h3 className="text-lg font-bold mb-4">Staff Members</h3>
              <ul className="space-y-2">
                {staffList.length > 0 &&
                  staffList.map((staff) => (
                    <li
                      key={staff.id}
                      className="p-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleSelection(staff, "staff")}
                    >
                      {staff.name}
                    </li>
                  ))}
              </ul>
            </div>
          )}
          {/* Business Level Content with checkboxes for each weekday */}
          {selectedLevel === "Business Level" && (
            <div>
              <h3 className="text-lg font-bold mb-4">Select Week Days</h3>
              <div className="space-y-2">
                {weekDays.map((day, index) => (
                  <div key={index} className="flex items-center">
                    <input
                      id={`day-${index}`}
                      type="checkbox"
                      checked={selectedDays[day] || false}
                      onChange={() => handleSelection(day, "day")}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor={`day-${index}`}
                      className="ml-2 block text-sm text-gray-900"
                    >
                      {day}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      </>
    </div>
  );
};

export default WeekOff;
