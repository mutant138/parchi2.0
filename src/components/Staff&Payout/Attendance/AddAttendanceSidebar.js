import { doc, setDoc, Timestamp } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { FaChevronRight } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { db } from "../../../firebase";
import { useSelector } from "react-redux";
import PaymentsDeductions from "./PaymentsDeductions";

function AddAttendanceSidebar({ onClose, isOpen, staff }) {
  const userDetails = useSelector((state) => state.users);
  const [activePaymentDeductionsStaff, setActivePaymentDeductionsStaff] =
    useState("");
  const companyId =
    userDetails.companies[userDetails.selectedCompanyIndex].companyId;
  const [staffData, setStaffData] = useState([]);
  const [attendanceForm, setAttendanceForm] = useState({
    date: Timestamp.fromDate(new Date()),
    staffs: [],
  });

  useEffect(() => {
    setStaffData(staff);
  }, [staff]);

  function getAttendanceStaffData(id) {
    return attendanceForm.staffs.find((ele) => ele.id === id);
  }

  function onUpdatedStaffAttendance(value, staff) {
    const removedPreviousStaffAttendance = attendanceForm.staffs.filter(
      (ele) => ele.id !== staff.id
    );
    setAttendanceForm((val) => ({
      ...val,
      staffs: [
        ...removedPreviousStaffAttendance,
        {
          id: staff.id,
          name: staff.name,
          status: value,
          shift: value === "present" ? 1 : 0,
        },
      ],
    }));
  }

  function DateFormate(timestamp) {
    if (!timestamp) {
      return;
    }
    const milliseconds =
      timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000;
    const date = new Date(milliseconds);
    const getDate = String(date.getDate()).padStart(2, "0");
    const getMonth = String(date.getMonth() + 1).padStart(2, "0");
    const getFullYear = date.getFullYear();
    return `${getFullYear}-${getMonth}-${getDate}`;
  }
  const today = new Date().toISOString().split("T")[0];
  function setDateAsId(timestamp) {
    if (!timestamp) {
      return;
    }
    const milliseconds =
      timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000;
    const date = new Date(milliseconds);
    const getDate = date.getDate();
    const getMonth = date.getMonth() + 1;
    const getFullYear = date.getFullYear();
    return `${getDate}${getMonth}${getFullYear}`;
  }

  async function AddAttendance() {
    try {
      if (!setDateAsId(attendanceForm.date)) {
        alert("please Select Date");
        return;
      }

      const payload = {
        ...attendanceForm,
        createdAt: Timestamp.fromDate(new Date()),
      };

      await setDoc(
        doc(
          db,
          "companies",
          companyId,
          "staffAttendance",
          setDateAsId(attendanceForm.date)
        ),
        payload
      );

      alert("Successfully Marked Attendance");
    } catch (error) {
      console.log("🚀 ~ AddAttendance ~ error:", error);
    }
  }
  function addPaymentDeductionToStaff(staffId, data) {
    const updatedAttendance = attendanceForm.staffs.map((ele) => {
      if (staffId === ele.id) {
        ele = { ...ele, ...data };
      }
      return ele;
    });
    setAttendanceForm((val) => ({ ...val, staffs: updatedAttendance }));
  }
  return (
    <div
      className={`fixed inset-0 z-50 flex justify-end bg-black bg-opacity-25 transition-opacity ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={onClose}
    >
      <div
        className={`bg-white  p-3 pt-2 transform transition-transform min-h-screen ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ width: "28vw" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between">
          <h2 className="font-bold text-xl mb-4"> Mark Attendance</h2>
          <button className="text-2xl mb-4" onClick={onClose}>
            <IoMdClose size={24} />
          </button>
        </div>
        <div>
          <div>
            <label className="text-sm block font-semibold mt-2">Date</label>
            <input
              type="date"
              className="w-full border border-gray-300 p-2 rounded-md  focus:outline-none"
              required
              value={DateFormate(attendanceForm.date)}
              max={today}
              onChange={(e) =>
                setAttendanceForm((val) => ({
                  ...val,
                  date: Timestamp.fromDate(new Date(e.target.value)),
                }))
              }
              onKeyDown={(e) => e.preventDefault()}
            />
          </div>
          <div className="overflow-y-auto" style={{ height: "70vh" }}>
            {staffData.length > 0 ? (
              staffData.map((staff) => (
                <div key={staff.id} className="border-b-2 py-2">
                  <div
                    className="text-sm block font-semibold mt-2 p-2 flex justify-between items-center cursor-pointer"
                    onClick={() => {
                      const staffAttendanceData = getAttendanceStaffData(
                        staff.id
                      );
                      if (staffAttendanceData?.status !== "present") {
                        alert("select Attendance");
                        return;
                      }
                      setActivePaymentDeductionsStaff({
                        name: staff.name,
                        isDailyWages: staff.isDailyWages,
                        ...staffAttendanceData,
                      });
                    }}
                  >
                    {staff.name} <FaChevronRight />
                  </div>
                  <div className="flex">
                    {["present", "absent", "leave", "holiday"].map(
                      (attendance) => (
                        <div key={attendance} className="flex-grow text-center">
                          <input
                            type="radio"
                            name={staff.id}
                            id={attendance + staff.id}
                            value={attendance}
                            onChange={(e) =>
                              onUpdatedStaffAttendance(e.target.value, staff)
                            }
                            className="hidden"
                          />
                          <label
                            htmlFor={attendance + staff.id}
                            className={`inline-block px-5 py-2 cursor-pointer border rounded-lg transition-all ease-in-out text-sm m-1 shadow-md ${
                              getAttendanceStaffData(staff.id)?.status ===
                              attendance
                                ? " border-blue-700 text-white" +
                                  ((attendance === "present" &&
                                    " bg-green-700 ") ||
                                    (attendance === "absent" &&
                                      " bg-red-700 ") ||
                                    (attendance === "leave" &&
                                      " bg-gray-500 ") ||
                                    (attendance === "holiday" &&
                                      " bg-purple-800 "))
                                : " bg-white text-blue-900 border-blue-700"
                            }`}
                          >
                            {attendance}
                          </label>
                        </div>
                      )
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div>No Staff Found</div>
            )}
          </div>
        </div>
        <button
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded w-full"
          onClick={AddAttendance}
        >
          Mark Attendance
        </button>
      </div>
      <div>
        <PaymentsDeductions
          onClose={() => setActivePaymentDeductionsStaff("")}
          staff={activePaymentDeductionsStaff}
          addPaymentDeductionToStaff={addPaymentDeductionToStaff}
        />
      </div>
    </div>
  );
}

export default AddAttendanceSidebar;
