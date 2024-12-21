import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useSelector } from "react-redux";
import { IoSearch } from "react-icons/io5";

function Quotation({ companyDetails, isStaff }) {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const userDetails = useSelector((state) => state.users);

  let companyId;
  if (!companyDetails) {
    companyId =
      userDetails.companies[userDetails.selectedCompanyIndex].companyId;
  } else {
    companyId = companyDetails.id;
  }
  const navigate = useNavigate();
  useEffect(() => {
    const fetchQuotations = async () => {
      setLoading(true);
      try {
        const quotationRef = collection(
          db,
          "companies",
          companyId,
          "quotations"
        );
        const querySnapshot = await getDocs(quotationRef);
        const quotationsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setQuotations(quotationsData);
      } catch (error) {
        console.error("Error fetching quotations:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuotations();
  }, [companyId]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusChange = async (quotationId, newStatus) => {
    try {
      const quotationDoc = doc(
        db,
        "companies",
        companyId,
        "quotations",
        quotationId
      );
      await updateDoc(quotationDoc, { paymentStatus: newStatus });
      setQuotations((prevQuotations) =>
        prevQuotations.map((quotation) =>
          quotation.id === quotationId
            ? { ...quotation, paymentStatus: newStatus }
            : quotation
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const filteredQuotations = quotations.filter((quotation) => {
    const { customerDetails, quotationNo, paymentStatus } = quotation;
    const customerName = customerDetails?.name || "";
    const matchesSearch =
      customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quotationNo?.toString().toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "All" || paymentStatus === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const totalAmount = filteredQuotations.reduce(
    (sum, quotation) => sum + quotation.total,
    0
  );

  const paidAmount = filteredQuotations
    .filter((quotation) => quotation.paymentStatus === "Paid")
    .reduce((sum, quotation) => sum + quotation.total, 0);
  const pendingAmount = filteredQuotations
    .filter((quotation) => quotation.paymentStatus === "Pending")
    .reduce((sum, quotation) => sum + quotation.total, 0);

  return (
    <div className="w-full">
      <div
        className="px-8 pb-8 pt-2 bg-gray-100 overflow-y-auto"
        style={{ height: "92vh" }}
      >
        <header className="flex items-center justify-between mb-3">
          <h1 className="text-2xl font-bold">Quotations</h1>
          <Link
            className="bg-blue-500 text-white py-1 px-2 rounded"
            to="create-quotation"
          >
            + Create Quotation
          </Link>
        </header>

        <div className="bg-white p-4 rounded-lg shadow mb-4">
          <nav className="flex space-x-4 mb-4">
            <button
              onClick={() => setFilterStatus("All")}
              className={`${
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
              placeholder="Search by transaction, customer, quotation #..."
              className=" w-full focus:outline-none"
              value={searchTerm}
              onChange={handleSearch}
            />
            <IoSearch />
          </div>

          {loading ? (
            <div className="text-center py-6">Loading quotations...</div>
          ) : (
            <div className="h-96 overflow-y-auto">
              <table className="w-full border-collapse  h-2/4">
                <thead className="sticky top-0 z-10 bg-white">
                  <tr className="border-b">
                    <th className="p-4">Customer</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Mode</th>
                    <th className="p-4">Quotation NO</th>
                    <th className="p-4">Date / Updated Time</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredQuotations.length > 0 ? (
                    filteredQuotations.map((quotation) => (
                      <tr
                        key={quotation.id}
                        className="border-b text-center cursor-pointer"
                        onClick={(e) => {
                          navigate(quotation.id);
                        }}
                      >
                        <td className=" py-3">
                          {quotation.customerDetails?.name} <br />
                          <span className="text-gray-500">
                            {quotation.customerDetails.phone}
                          </span>
                        </td>
                        <td className="py-3">{`₹ ${quotation.total.toFixed(
                          2
                        )}`}</td>
                        <td
                          className="py-3"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <select
                            value={quotation.paymentStatus}
                            onChange={(e) => {
                              handleStatusChange(quotation.id, e.target.value);
                            }}
                            className={`border p-1 rounded ${
                              quotation.paymentStatus === "Paid"
                                ? "bg-green-100 text-green-700"
                                : quotation.paymentStatus === "Pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Paid">Paid</option>
                            <option value="UnPaid">UnPaid</option>
                          </select>
                        </td>
                        <td className="py-3">{quotation.mode || "Online"}</td>
                        <td className="py-3">{quotation.quotationNo}</td>

                        <td className="py-3">
                          {(() => {
                            if (
                              quotation.date &&
                              typeof quotation.date.seconds === "number"
                            ) {
                              const quotationDate = new Date(
                                quotation.date.seconds * 1000
                              );
                              const today = new Date();
                              const timeDiff =
                                today.setHours(0, 0, 0, 0) -
                                quotationDate.setHours(0, 0, 0, 0);
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
                        No quotations found
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
}

export default Quotation;
