import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useSelector } from "react-redux";
import { IoSearch } from "react-icons/io5";

const ProFormaInvoice = () => {
  const [proForma, setProForma] = useState([]);
  const [isProFormaOpen, setIsProFormaOpen] = useState(false);
  const invoiceRef = useRef();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProFormaData, setSelectedProFormaData] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");

  const userDetails = useSelector((state) => state.users);

  const companyId =
    userDetails.companies[userDetails.selectedCompanyIndex].companyId;
  const navigate = useNavigate();
  useEffect(() => {
    const fetchProForma = async () => {
      setLoading(true);
      try {
        const invoiceRef = collection(
          db,
          "companies",
          companyId,
          "proFormaInvoice"
        );
        const querySnapshot = await getDocs(invoiceRef);
        const proFormaData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // const q = query(invoiceRef, orderBy("date", "desc"));
        // const querySnapshot = await getDocs(q);
        // const proFormaData = querySnapshot.docs.map((doc) => ({
        //   id: doc.id,
        //   ...doc.data(),
        // }));
        setSelectedProFormaData(proFormaData[0]);
        setProForma(proFormaData);
      } catch (error) {
        console.error("Error fetching proForma:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProForma();
  }, [companyId]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusChange = async (invoiceId, newStatus) => {
    try {
      const invoiceDoc = doc(
        db,
        "companies",
        companyId,
        "proFormaInvoice",
        invoiceId
      );
      await updateDoc(invoiceDoc, { paymentStatus: newStatus });
      setProForma((prevProForma) =>
        prevProForma.map((invoice) =>
          invoice.id === invoiceId
            ? { ...invoice, paymentStatus: newStatus }
            : invoice
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const filteredProForma = proForma.filter((invoice) => {
    const { customerDetails, invoiceNo, paymentStatus } = invoice;
    const customerName = customerDetails?.name || "";
    const matchesSearch =
      customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoiceNo?.toString().toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "All" || paymentStatus === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const totalAmount = filteredProForma.reduce(
    (sum, invoice) => sum + invoice.total,
    0
  );
  const paidAmount = filteredProForma
    .filter((invoice) => invoice.paymentStatus === "Paid")
    .reduce((sum, invoice) => sum + invoice.total, 0);
  const pendingAmount = filteredProForma
    .filter((invoice) => invoice.paymentStatus === "Pending")
    .reduce((sum, invoice) => sum + invoice.total, 0);

  return (
    <div className="w-full">
      <div
        className="px-8 pb-8 pt-2 bg-gray-100 overflow-y-auto"
        style={{ height: "92vh" }}
      >
        <header className="flex items-center justify-between mb-3">
          <h1 className="text-2xl font-bold">ProForma</h1>
          <Link
            className="bg-blue-500 text-white py-1 px-2 rounded"
            to="create-invoice"
          >
            + Create ProForma Invoice
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
              placeholder="Search by transaction, customer, invoice #..."
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
            <div className="text-center py-6">Loading ProForma...</div>
          ) : (
            <div className="h-96 overflow-y-auto">
              <table className="w-full border-collapse  h-2/4 text-center">
                <thead className="sticky top-0 z-10 bg-white">
                  <tr className="border-b">
                    <th className="p-4">Customer</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Mode</th>
                    <th className="p-4">Invoice NO</th>
                    <th className="p-4">Date / Updated Time</th>
                    {/* <th className="p-4">Actions</th> */}
                  </tr>
                </thead>
                <tbody>
                  {filteredProForma.length > 0 ? (
                    filteredProForma.map((invoice) => (
                      <tr
                        key={invoice.id}
                        className="border-b text-center cursor-pointer"
                        onClick={(e) => {
                          navigate(invoice.id);
                        }}
                      >
                        <td className="py-3">
                          {invoice.customerDetails?.name} <br />
                          <span className="text-gray-500">
                            {invoice.customerDetails.phoneNumber}
                          </span>
                        </td>
                        <td className="py-3">{`₹ ${invoice.total.toFixed(
                          2
                        )}`}</td>
                        <td
                          className="py-3"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <select
                            value={invoice.paymentStatus}
                            onChange={(e) => {
                              handleStatusChange(invoice.id, e.target.value);
                            }}
                            className={`border p-1 rounded ${
                              invoice.paymentStatus === "Paid"
                                ? "bg-green-100 text-green-700"
                                : invoice.paymentStatus === "Pending"
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
                          {invoice.paymentMode || "Online"}
                        </td>
                        <td className="py-3">{invoice.invoiceNo}</td>

                        <td className="py-3">
                          {(() => {
                            if (
                              invoice.date &&
                              typeof invoice.date.seconds === "number"
                            ) {
                              const invoiceDate = new Date(
                                invoice.date.seconds * 1000
                              );
                              const today = new Date();
                              const timeDiff =
                                today.setHours(0, 0, 0, 0) -
                                invoiceDate.setHours(0, 0, 0, 0);
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
                            onClick={() => handleInvoiceClick(invoice)}
                            // onBlur={() => setIsProFormaOpen(false)}
                          >
                            <FaRegEye />
                            <div className="absolute left-1/2 transform -translate-x-1/2 top-5 px-2 py-1 bg-gray-600 text-white text-xs rounded-md opacity-0 group-hover:opacity-100">
                              View
                            </div>
                          </button>
                          <button
                            className="relative group text-green-500 hover:text-green-700 text-xl"
                            onClick={() => {
                              setSelectedProFormaData(invoice);
                              handleDownloadPdf(invoice);
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
                        No ProForma found
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

export default ProFormaInvoice;
