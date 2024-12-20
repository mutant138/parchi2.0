import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import jsPDF from "jspdf";
import { useSelector } from "react-redux";
import { FaRegEye } from "react-icons/fa";
import { IoMdClose, IoMdDownload } from "react-icons/io";
import { IoSearch } from "react-icons/io5";

const POS = () => {
  const [pos, setPos] = useState([]);
  const [isPosOpen, setIsPosOpen] = useState(false);
  const posRef = useRef();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPosData, setSelectedPosData] =
    useState(null);
  const [filterStatus, setFilterStatus] = useState("All");

  const userDetails = useSelector((state) => state.users);

  const companyId =
    userDetails.companies[userDetails.selectedCompanyIndex].companyId;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPos = async () => {
      setLoading(true);
      try {
        const posRef = collection(
          db,
          "companies",
          companyId,
          "pos"
        );
        const querySnapshot = await getDocs(posRef);
        const posData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        // const q = query(posRef, orderBy("date", "desc"));
        // const querySnapshot = await getDocs(q);
        // const posData = querySnapshot.docs.map((doc) => ({
        //   id: doc.id,
        //   ...doc.data(),
        // }));
        setSelectedPosData(posData[0]);
        setPos(posData);
      } catch (error) {
        console.error("Error fetching pos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPos();
  }, [companyId]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleposClick = async (posData) => {
    try {
      setSelectedPosData(posData);
      setIsPosOpen(true);
    } catch (error) {
      console.error("Error fetching pos:", error);
    }
  };

  const handleStatusChange = async (posId, newStatus) => {
    try {
      const posDoc = doc(
        db,
        "companies",
        companyId,
        "pos",
        posId
      );
      await updateDoc(posDoc, { paymentStatus: newStatus });
      setPos((prevpos) =>
        prevpos.map((pos) =>
          pos.id === posId
            ? { ...pos, paymentStatus: newStatus }
            : pos
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const filteredPos = pos.filter((dc) => {
    const { customerDetails, posNo, paymentStatus } = dc;
    const customerName = customerDetails?.name || "";
    const matchesSearch =
      customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      posNo
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

  const totalAmount = filteredPos.reduce(
    (sum, pos) => sum + pos.total,
    0
  );

  const paidAmount = filteredPos
    .filter((pos) => pos.paymentStatus === "Paid")
    .reduce((sum, pos) => sum + pos.total, 0);
  const pendingAmount = filteredPos
    .filter((pos) => pos.paymentStatus === "Pending")
    .reduce((sum, pos) => sum + pos.total, 0);

  const handleDownloadPdf = (pos) => {
    const doc = new jsPDF("p", "pt", "a4");
    doc.html(posRef.current, {
      callback: function (doc) {
        doc.save(
          `${pos.customerDetails.name}'s pos.pdf`
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
          <h1 className="text-2xl font-bold">POS</h1>
          <Link
            className="bg-blue-500 text-white py-1 px-2 rounded"
            to="create-pos"
          >
            + POS
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
              placeholder="Search by customer name, phone number, pos number#..."
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
            <div className="text-center py-6">Loading pos...</div>
          ) : (
            <div className="h-96 overflow-y-auto">
              <table className="w-full border-collapse  h-2/4 text-center">
                <thead className="sticky top-0 z-10 bg-white">
                  <tr className="border-b">
                    <th className="p-4">Customer</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Mode</th>
                    <th className="p-4">POS NO</th>
                    <th className="p-4">Date / Updated Time</th>
                    {/* <th className="p-4">Actions</th> */}
                  </tr>
                </thead>
                <tbody>
                  {filteredPos.length > 0 ? (
                    filteredPos.map((pos) => (
                      <tr
                        key={pos.id}
                        className="border-b text-center cursor-pointer"
                        onClick={(e) => {
                          navigate(pos.id);
                        }}
                      >
                        <td className="py-3">
                          {pos.customerDetails?.name} <br />
                          <span className="text-gray-500">
                            {pos.customerDetails.phone}
                          </span>
                        </td>
                        <td className="py-3">{`₹ ${pos.total.toFixed(
                          2
                        )}`}</td>
                        <td
                          className="py-3"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <select
                            value={pos.paymentStatus}
                            onChange={(e) => {
                              handleStatusChange(
                                pos.id,
                                e.target.value
                              );
                            }}
                            className={`border p-1 rounded ${
                              pos.paymentStatus === "Paid"
                                ? "bg-green-100 text-green-700"
                                : pos.paymentStatus === "Pending"
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
                          {pos.mode || "Online"}
                        </td>
                        <td className="py-3">
                          {pos.posNo}
                        </td>

                        <td className="py-3">
                          {(() => {
                            if (
                              pos?.posDate.seconds &&
                              typeof pos.posDate
                                .seconds === "number"
                            ) {
                              const date = new Date(
                                pos.posDate.seconds *
                                  1000
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
                            onClick={() => handleposClick(pos)}
                            // onBlur={() => setIsPosOpen(false)}
                          >
                            <FaRegEye />
                            <div className="absolute left-1/2 transform -translate-x-1/2 top-5 px-2 py-1 bg-gray-600 text-white text-xs rounded-md opacity-0 group-hover:opacity-100">
                              View
                            </div>
                          </button>
                          <button
                            className="relative group text-green-500 hover:text-green-700 text-xl"
                            onClick={() => {
                              setSelectedPosData(pos);
                              handleDownloadPdf(pos);
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
                        No POS found
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
        onClick={() => setIsPosOpen(false)}
        style={{ display: isPosOpen ? "block" : "none" }}
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
                  onClick={() => setIsPosOpen(false)}
                >
                  <IoMdClose />
                  <div className="absolute left-1/2 transform -translate-x-1/2 top-8 px-1 py-1 bg-gray-600 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 z-200">
                    Close
                  </div>
                </div>
              </div>
               <Template1 ref={posRef} posData={selectedPosData} /> 
            </div>
             <div className="flex justify-around ">
                <button
                  className="bg-red-500 text-white py-2 px-4 rounded"
                  onClick={() => {
                    setIsPosOpen(false);
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

export default POS;
