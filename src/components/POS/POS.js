import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useSelector } from "react-redux";
import { IoSearch } from "react-icons/io5";

const POS = () => {
  const [POS, setPOS] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const userDetails = useSelector((state) => state.users);

  const companyId =
    userDetails.companies[userDetails.selectedCompanyIndex].companyId;
  const navigate = useNavigate();
  useEffect(() => {
    const fetchPOS = async () => {
      setLoading(true);
      try {
        const POSRef = collection(db, "companies", companyId, "POS");
        const querySnapshot = await getDocs(POSRef);
        const POSData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPOS(POSData);
      } catch (error) {
        console.error("Error fetching POS:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPOS();
  }, [companyId]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusChange = async (POSId, newStatus) => {
    try {
      const POSDoc = doc(db, "companies", companyId, "pos", POSId);
      await updateDoc(POSDoc, { paymentStatus: newStatus });
      setPOS((prevPOS) =>
        prevPOS.map((POS) =>
          POS.id === POSId ? { ...POS, paymentStatus: newStatus } : POS
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const filteredPOS = POS.filter((POS) => {
    const { customerDetails, POSNo, paymentStatus } = POS;
    const customerName = customerDetails?.name || "";
    const matchesSearch =
      customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      POSNo?.toString().toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "All" || paymentStatus === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const totalAmount = filteredPOS.reduce((sum, POS) => sum + POS.total, 0);
  const paidAmount = filteredPOS
    .filter((POS) => POS.paymentStatus === "Paid")
    .reduce((sum, POS) => sum + POS.total, 0);
  const pendingAmount = filteredPOS
    .filter((POS) => POS.paymentStatus === "Pending")
    .reduce((sum, POS) => sum + POS.total, 0);

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
            + Create POS
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
              placeholder="Search by transaction, customer, POS #..."
              className=" w-full focus:outline-none"
              value={searchTerm}
              onChange={handleSearch}
            />
            <IoSearch />
          </div>

          {loading ? (
            <div className="text-center py-6">Loading POS...</div>
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
                  {filteredPOS.length > 0 ? (
                    filteredPOS.map((POS) => (
                      <tr
                        key={POS.id}
                        className="border-b text-center cursor-pointer"
                        onClick={(e) => {
                          navigate(POS.id);
                        }}
                      >
                        <td className="py-3">
                          {POS.customerDetails?.name} <br />
                          <span className="text-gray-500">
                            {POS.customerDetails.phoneNumber}
                          </span>
                        </td>
                        <td className="py-3">{`₹ ${POS.total.toFixed(2)}`}</td>
                        <td
                          className="py-3"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <select
                            value={POS.paymentStatus}
                            onChange={(e) => {
                              handleStatusChange(POS.id, e.target.value);
                            }}
                            className={`border p-1 rounded ${
                              POS.paymentStatus === "Paid"
                                ? "bg-green-100 text-green-700"
                                : POS.paymentStatus === "Pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Paid">Paid</option>
                            <option value="UnPaid">UnPaid</option>
                          </select>
                        </td>
                        <td className="py-3">{POS.paymentMode || "Online"}</td>
                        <td className="py-3">{POS.POSNo}</td>

                        <td className="py-3">
                          {(() => {
                            if (
                              POS.date &&
                              typeof POS.date.seconds === "number"
                            ) {
                              const POSDate = new Date(POS.date.seconds * 1000);
                              const today = new Date();
                              const timeDiff =
                                today.setHours(0, 0, 0, 0) -
                                POSDate.setHours(0, 0, 0, 0);
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
    </div>
  );
};

export default POS;
