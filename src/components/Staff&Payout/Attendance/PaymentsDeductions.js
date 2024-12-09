import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";

function PaymentsDeductions({ isOpen, onClose }) {
  const [selectedShift, setSelectedShift] = useState("");
  const [selectedTiming, setSelectedTiming] = useState("");
  const [selectedAllowance, setSelectedAllowance] = useState("");
  return (
    <div
      className={`fixed inset-0 z-100 flex justify-end bg-black bg-opacity-25 transition-opacity ${
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
          <h2 className="font-bold text-xl"> Payments & Deductions</h2>
          <button className="text-2xl" onClick={onClose}>
            <IoMdClose size={24} />
          </button>
        </div>
        <div className=" my-2"> Amount Calculation</div>
        <div className="overflow-y-auto" style={{ height: "70vh" }}>
          <div>
            <label className="text-sm block font-semibold mt-2">Shift</label>
            <div className="flex">
              {["0.5 Shift", "1 Shift", "1.5 Shift", "2 Shift"].map((shift) => (
                <div key={shift} className="flex-grow text-center">
                  <input
                    type="radio"
                    name="shift"
                    id={shift}
                    value={shift}
                    className="hidden"
                    onChange={(e) => setSelectedShift(e.target.value)}
                  />
                  <label
                    htmlFor={shift}
                    className={`inline-block px-5 py-2 cursor-pointer border rounded-lg transition-all ease-in-out text-sm m-1 shadow-md ${
                      selectedShift === shift
                        ? "border-blue-700  bg-blue-700 text-white "
                        : "bg-white text-blue-900 border-blue-700"
                    }`}
                  >
                    {shift}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="my-3">
            <div className="flex">
              {["OverTime", "LateFine"].map((time) => (
                <div key={time} className="flex-grow text-center">
                  <input
                    type="radio"
                    name="time"
                    id={time}
                    value={time}
                    className="hidden"
                    onChange={(e) => setSelectedTiming(e.target.value)}
                  />
                  <label
                    htmlFor={time}
                    className={`inline-block px-5 py-2 cursor-pointer border rounded-lg transition-all ease-in-out text-sm m-1 shadow-md ${
                      selectedTiming === time
                        ? "border-blue-700  bg-green-700 text-white "
                        : "bg-white text-blue-900 border-blue-700"
                    }`}
                  >
                    {time}
                  </label>
                </div>
              ))}
            </div>
            <div className="flex w-full my-2">
              <input
                type="number"
                placeholder="Hours"
                className="w-full border border-gray-300 p-2 rounded-l-lg focus:outline-none "
              />
              <input
                type="number"
                placeholder="Amount"
                className="w-full border border-gray-300 p-2 rounded-r-lg focus:outline-none "
              />
            </div>
          </div>
          <div className="my-3">
            <div className="flex">
              {["Allowance", "Deduction"].map((items) => (
                <div key={items} className="flex-grow text-center">
                  <input
                    type="radio"
                    name="all-ded"
                    id={items}
                    value={items}
                    className="hidden"
                    onChange={(e) => setSelectedAllowance(e.target.value)}
                  />
                  <label
                    htmlFor={items}
                    className={`inline-block px-5 py-2 cursor-pointer border rounded-lg transition-all ease-in-out text-sm m-1 shadow-md ${
                      selectedAllowance === items
                        ? "border-blue-700  bg-green-700 text-white "
                        : "bg-white text-blue-900 border-blue-700"
                    }`}
                  >
                    {items}
                  </label>
                </div>
              ))}
            </div>
            <div className="flex w-full my-2">
              <input
                type="number"
                placeholder="Hours"
                className="w-full border border-gray-300 p-2 rounded-l-lg focus:outline-none "
              />
              <input
                type="number"
                placeholder="Amount"
                className="w-full border border-gray-300 p-2 rounded-r-lg focus:outline-none "
              />
            </div>
          </div>
          <button
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded w-full"
            onClick={onClose}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentsDeductions;
