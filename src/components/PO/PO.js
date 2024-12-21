import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { FaRegEye } from "react-icons/fa";
import { IoMdDownload } from "react-icons/io";
import { IoSearch } from "react-icons/io5";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { db } from "../../firebase";

function PO({ companyDetails, isStaff }) {
  const [filterStatus, setFilterStatus] = useState("All");
  const [loading, setLoading] = useState(!true);
  const userDetails = useSelector((state) => state.users);
  let companyId;
  if (!companyDetails) {
    companyId =
      userDetails.companies[userDetails.selectedCompanyIndex].companyId;
  } else {
    companyId = companyDetails.id;
  }

  const selectedDashboardUser = userDetails.selectedDashboard;
  const navigate = useNavigate();
  const [POList, setPOList] = useState([]);

  const [POCount, setPOCount] = useState({
    total: 0,
    received: 0,
    totalPrice: 0,
  });

  const [searchTerm, setSearchTerm] = useState("");

  const filteredPO = POList.filter((po) => {
    const { vendorDetails, no, orderStatus } = po;
    const vendorName = vendorDetails?.name || "";
    const matchesSearch =
      vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      no?.toString().toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "All" || orderStatus === filterStatus;

    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    async function fetchPoList() {
      setLoading(true);
      try {
        const getData = await getDocs(
          collection(db, "companies", companyId, "po")
        );
        let receivedCount = 0;
        let totalPrice = 0;
        const data = getData.docs.map((doc) => {
          const res = doc.data();
          if (res.orderStatus === "Received") {
            ++receivedCount;
          }
          totalPrice += res.total;
          return {
            id: doc.id,
            ...res,
          };
        });
        setPOList(data);
        setPOCount({
          total: data.length,
          received: receivedCount,
          totalPrice: totalPrice,
        });
      } catch (error) {
        console.log("🚀 ~ fetchPoList ~ error:", error);
      }
      setLoading(false);
    }
    fetchPoList();
  }, []);

  async function onStatusUpdate(value, poId) {
    try {
      const docRef = doc(db, "companies", companyId, "po", poId);
      await updateDoc(docRef, { orderStatus: value });
      const UpdatedData = POList.map((ele) => {
        if (ele.id === poId) {
          ele.orderStatus = value;
        }
        return ele;
      });
      setPOList(UpdatedData);
      alert("Successfully Status Updated");
    } catch (error) {
      console.log("🚀 ~ onStatusUpdate ~ error:", error);
    }
  }

  return (
    <div className="w-full">
      <div
        className="px-8 pb-8 pt-2 bg-gray-100 overflow-y-auto"
        style={{ height: "92vh" }}
      >
        <header className="flex items-center justify-between mb-3">
          <h1 className="text-2xl font-bold">PO</h1>
          <Link
            className="bg-blue-500 text-white py-1 px-2 rounded"
            to="create-po"
          >
            + New PO
          </Link>
        </header>
        <div className="bg-white rounded-lg shadow mb-4">
          <div className="flex justify-between text-center p-4">
            <div className="border-r-2 w-full">
              <div>All PO's</div>
              <div>{POCount.total}</div>
            </div>
            <div className=" w-full">
              <div>Received PO</div>
              <div>{POCount.received}</div>
            </div>
          </div>
          <div className="flex justify-between bg-green-500  text-center p-2 px-5 rounded-b-lg">
            <div>Total Paid PO's</div>
            <div>{POCount.totalPrice}</div>
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
              All Transactions
            </button>
            <button
              onClick={() => setFilterStatus("Pending")}
              className={`${
                filterStatus === "Pending"
                  ? "text-blue-500 font-semibold"
                  : "text-gray-500"
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilterStatus("Received")}
              className={`${
                filterStatus === "Received"
                  ? "text-blue-500 font-semibold"
                  : "text-gray-500"
              }`}
            >
              Received
            </button>
          </nav>
          <div className="flex items-center space-x-4 mb-4 border p-2 rounded">
            <input
              type="text"
              placeholder="Search by transaction, Vendors, PO #..."
              className=" w-full focus:outline-none"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <IoSearch />
          </div>
          {loading ? (
            <div className="text-center py-6">Loading PO's...</div>
          ) : (
            <div className="h-96 overflow-y-auto">
              <table className="w-full text-left border-collapse text-center h-2/4">
                <thead className="sticky top-0 z-10 bg-white">
                  <tr className="border-b">
                    <th className="p-4">Vendor</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Mode</th>
                    <th className="p-4">PO No.</th>
                    <th className="p-4">Date / Updated Time</th>
                    {/* <th className="p-4">Actions</th> */}
                  </tr>
                </thead>
                <tbody>
                  {filteredPO.length > 0 ? (
                    filteredPO.map((po) => (
                      <tr
                        key={po.id}
                        className="border-b cursor-pointer "
                        onClick={(e) => {
                          navigate(po.id);
                        }}
                      >
                        <td className="py-3 ">
                          {po.vendorDetails?.name} <br />
                          <span className="text-gray-500">
                            {po.vendorDetails.phoneNumber}
                          </span>
                        </td>
                        <td className="py-3 ">{`₹ ${po.total.toFixed(2)}`}</td>
                        <td
                          className="py-3 "
                          onClick={(e) => e.stopPropagation()}
                        >
                          <select
                            value={po.orderStatus}
                            className={`border p-1 rounded ${
                              po.orderStatus !== "Pending"
                                ? "bg-green-200  text-green-900"
                                : "bg-red-200  text-red-900"
                            }`}
                            onChange={(e) =>
                              onStatusUpdate(e.target.value, po.id)
                            }
                          >
                            <option value="Pending">Pending</option>
                            <option value="Received">Received</option>
                          </select>
                        </td>
                        <td className="py-3 ">{po.mode || "Online"}</td>
                        <td className="py-3 ">{po.poNo}</td>

                        <td className="py-3 ">
                          {(() => {
                            if (
                              po.date.seconds &&
                              typeof po.date.seconds === "number"
                            ) {
                              const date = new Date(po.date.seconds * 1000);
                              const today = new Date();
                              const timeDiff =
                                today.setHours(0, 0, 0, 0) -
                                date.setHours(0, 0, 0, 0);
                              const daysDiff = Math.floor(
                                timeDiff / (1000 * 60 * 60 * 24)
                              );

                              if (daysDiff === 0) return "Today";
                              if (daysDiff === 1) return "Yesterday";
                              return `${daysDiff} days ago`;
                            } else {
                              return "Date not available";
                            }
                          })()}
                        </td>

                        {/* <td className="py-3 space-x-3">
                          <button className="relative group text-green-500 hover:text-green-700 text-xl">
                            <FaRegEye />
                            <div className="absolute left-1/2 transform -translate-x-1/2 top-5 px-2 py-1 bg-gray-600 text-white text-xs rounded-md opacity-0 group-hover:opacity-100">
                              View
                            </div>
                          </button>
                          <button className="relative group text-green-500 hover:text-green-700 text-xl">
                            <IoMdDownload />
                            <div className="absolute left-1/2 transform -translate-x-1/2 top-5 px-2 py-1 bg-gray-600 text-white text-xs rounded-md opacity-0 group-hover:opacity-100">
                              Download
                            </div>
                          </button>
                        </td> */}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-4">
                        No PO found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PO;
