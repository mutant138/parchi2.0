import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import jsPDF from "jspdf";
import { useSelector } from "react-redux";
import { FaRegEye } from "react-icons/fa";
import { IoMdClose, IoMdDownload } from "react-icons/io";
import { IoSearch } from "react-icons/io5";

const DeliveryChallanList = () => {
  const [deliveryChallan, setDeliveryChallan] = useState([]);
  const [isDeliveryChallanOpen, setIsDeliveryChallanOpen] = useState(false);
  const deliveryChallanRef = useRef();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDeliveryChallanData, setSelectedDeliveryChallanData] =
    useState(null);
  const [filterStatus, setFilterStatus] = useState("All");

  const userDetails = useSelector((state) => state.users);

  const companyId =
    userDetails.companies[userDetails.selectedCompanyIndex].companyId;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDeliveryChallan = async () => {
      setLoading(true);
      try {
        const deliveryChallanRef = collection(
          db,
          "companies",
          companyId,
          "deliverychallan"
        );
        const querySnapshot = await getDocs(deliveryChallanRef);
        const deliveryChallanData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        // const q = query(deliveryChallanRef, orderBy("date", "desc"));
        // const querySnapshot = await getDocs(q);
        // const deliveryChallanData = querySnapshot.docs.map((doc) => ({
        //   id: doc.id,
        //   ...doc.data(),
        // }));
        setSelectedDeliveryChallanData(deliveryChallanData[0]);
        setDeliveryChallan(deliveryChallanData);
      } catch (error) {
        console.error("Error fetching deliveryChallan:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDeliveryChallan();
  }, [companyId]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDeliveryChallanClick = async (deliveryChallanData) => {
    try {
      setSelectedDeliveryChallanData(deliveryChallanData);
      setIsDeliveryChallanOpen(true);
    } catch (error) {
      console.error("Error fetching deliveryChallan:", error);
    }
  };

  const handleStatusChange = async (deliveryChallanId, newStatus) => {
    try {
      const deliveryChallanDoc = doc(
        db,
        "companies",
        companyId,
        "deliverychallan",
        deliveryChallanId
      );
      await updateDoc(deliveryChallanDoc, { paymentStatus: newStatus });
      setDeliveryChallan((prevDeliveryChallan) =>
        prevDeliveryChallan.map((deliveryChallan) =>
          deliveryChallan.id === deliveryChallanId
            ? { ...deliveryChallan, paymentStatus: newStatus }
            : deliveryChallan
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const filteredDeliveryChallan = deliveryChallan.filter((dc) => {
    const { customerDetails, deliveryChallanNo, paymentStatus } = dc;
    const customerName = customerDetails?.name || "";
    const matchesSearch =
      customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deliveryChallanNo
        ?.toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      customerDetails?.phone
        .toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "All" || paymentStatus === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const totalAmount = filteredDeliveryChallan.reduce(
    (sum, deliveryChallan) => sum + deliveryChallan.total,
    0
  );

  const paidAmount = filteredDeliveryChallan
    .filter((deliveryChallan) => deliveryChallan.paymentStatus === "Paid")
    .reduce((sum, deliveryChallan) => sum + deliveryChallan.total, 0);
  const pendingAmount = filteredDeliveryChallan
    .filter((deliveryChallan) => deliveryChallan.paymentStatus === "Pending")
    .reduce((sum, deliveryChallan) => sum + deliveryChallan.total, 0);

  const handleDownloadPdf = (deliveryChallan) => {
    const doc = new jsPDF("p", "pt", "a4");
    doc.html(deliveryChallanRef.current, {
      callback: function (doc) {
        doc.save(
          `${deliveryChallan.customerDetails.name}'s deliveryChallan.pdf`
        );
      },
      x: 0,
      y: 0,
    });
  };

  return (
    <div className="w-full">
      <div
        className="px-8 pb-8 pt-2 bg-gray-100 overflow-y-auto"
        style={{ height: "92vh" }}
      >
        <header className="flex items-center justify-between mb-3">
          <h1 className="text-2xl font-bold">Delivery Challan</h1>
          <Link
            className="bg-blue-500 text-white py-1 px-2 rounded"
            to="create-deliverychallan"
          >
            + Create Delivery Challan
          </Link>
        </header>

        <div className="bg-white p-4 rounded-lg shadow mb-4">
          <nav className="flex space-x-4 mb-4">
            <button
              onClick={() => setFilterStatus("All")}
              className={` ${
                filterStatus === "All"
                  ? "text-blue-500 font-semibold"
                  : "text-gray-500"
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
              onClick={() => setFilterStatus("Paid")}
              className={`${
                filterStatus === "Paid"
                  ? "text-blue-500 font-semibold"
                  : "text-gray-500"
              }`}
            >
              Paid
            </button>

            <button
              onClick={() => setFilterStatus("UnPaid")}
              className={`${
                filterStatus === "UnPaid"
                  ? "text-blue-500 font-semibold"
                  : "text-gray-500"
              }`}
            >
              UnPaid
            </button>
          </nav>
          <div className="flex items-center space-x-4 mb-4 border p-2 rounded">
            <input
              type="text"
              placeholder="Search by customer name, phone number, deliveryChallan number#..."
              className=" w-full focus:outline-none"
              value={searchTerm}
              onChange={handleSearch}
            />
            <IoSearch />
            {/* <input type="date" className="border p-2 rounded" />
              <span>-</span>
              <input type="date" className="border p-2 rounded" /> */}
          </div>

          {loading ? (
            <div className="text-center py-6">Loading deliveryChallan...</div>
          ) : (
            <div className="h-96 overflow-y-auto">
              <table className="w-full border-collapse  h-2/4 text-center">
                <thead className="sticky top-0 z-10 bg-white">
                  <tr className="border-b">
                    <th className="p-4">Customer</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Mode</th>
                    <th className="p-4">DeliveryChallan NO</th>
                    <th className="p-4">Date / Updated Time</th>
                    {/* <th className="p-4">Actions</th> */}
                  </tr>
                </thead>
                <tbody>
                  {filteredDeliveryChallan.length > 0 ? (
                    filteredDeliveryChallan.map((deliveryChallan) => (
                      <tr
                        key={deliveryChallan.id}
                        className="border-b text-center cursor-pointer"
                        onClick={(e) => {
                          navigate(deliveryChallan.id);
                        }}
                      >
                        <td className="py-3">
                          {deliveryChallan.customerDetails?.name} <br />
                          <span className="text-gray-500">
                            {deliveryChallan.customerDetails.phone}
                          </span>
                        </td>
                        <td className="py-3">{`₹ ${deliveryChallan.total.toFixed(
                          2
                        )}`}</td>
                        <td
                          className="py-3"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <select
                            value={deliveryChallan.paymentStatus}
                            onChange={(e) => {
                              handleStatusChange(
                                deliveryChallan.id,
                                e.target.value
                              );
                            }}
                            className={`border p-1 rounded ${
                              deliveryChallan.paymentStatus === "Paid"
                                ? "bg-green-100 text-green-700"
                                : deliveryChallan.paymentStatus === "Pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Paid">Paid</option>
                            <option value="UnPaid">UnPaid</option>
                          </select>
                        </td>
                        <td className="py-3">
                          {deliveryChallan.mode || "Online"}
                        </td>
                        <td className="py-3">
                          {deliveryChallan.deliveryChallanNo}
                        </td>

                        <td className="py-3">
                          {(() => {
                            if (
                              deliveryChallan.date.seconds &&
                              typeof deliveryChallan.date.seconds === "number"
                            ) {
                              const date = new Date(
                                deliveryChallan.date.seconds * 1000
                              );
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

                        {/* <td className="py-3 space-x-2">
                          <button
                            className="relative group text-green-500 hover:text-green-700 text-xl"
                            onClick={() => handleDeliveryChallanClick(deliveryChallan)}
                            // onBlur={() => setIsDeliveryChallanOpen(false)}
                          >
                            <FaRegEye />
                            <div className="absolute left-1/2 transform -translate-x-1/2 top-5 px-2 py-1 bg-gray-600 text-white text-xs rounded-md opacity-0 group-hover:opacity-100">
                              View
                            </div>
                          </button>
                          <button
                            className="relative group text-green-500 hover:text-green-700 text-xl"
                            onClick={() => {
                              setSelectedDeliveryChallanData(deliveryChallan);
                              handleDownloadPdf(deliveryChallan);
                            }}
                          >
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
                      <td colSpan="6" className="text-center py-4">
                        No Delivery Challan found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <footer className="flex justify-between bg-white p-4 rounded-lg shadow mt-4">
          <div>Total ₹ {totalAmount}</div>
          <div>Paid ₹ {paidAmount}</div>
          <div>Pending ₹ {pendingAmount}</div>
        </footer>
      </div>

      {/* <div
        className="fixed inset-0 z-20 "
        onClick={() => setIsDeliveryChallanOpen(false)}
        style={{ display: isDeliveryChallanOpen ? "block" : "none" }}
      >
        <div
          className="fixed inset-0 flex pt-10 justify-center z-20 "
          style={{ backgroundColor: "#0009" }}
        >
          <div className="h-4/5 " onClick={(e) => e.stopPropagation()}>
            <div className="bg-white mb-5 overflow-y-auto w-fit h-fit rounded ">
              <div className="flex justify-end border-b-2 py-2">
                <div
                  className="relative text-2xl text-red-700 group px-2 cursor-pointer"
                  onClick={() => setIsDeliveryChallanOpen(false)}
                >
                  <IoMdClose />
                  <div className="absolute left-1/2 transform -translate-x-1/2 top-8 px-1 py-1 bg-gray-600 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 z-200">
                    Close
                  </div>
                </div>
              </div>
               <Template1 ref={deliveryChallanRef} deliveryChallanData={selectedDeliveryChallanData} /> 
            </div>
             <div className="flex justify-around ">
                <button
                  className="bg-red-500 text-white py-2 px-4 rounded"
                  onClick={() => {
                    setIsDeliveryChallanOpen(false);
                  }}
                >
                  Close
                </button>

                <button
                  className="bg-blue-500 text-white py-2 px-4 rounded"
                  onClick={handleDownloadPdf}
                >
                  Download
                </button>
              </div> 
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default DeliveryChallanList;
