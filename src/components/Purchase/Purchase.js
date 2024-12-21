import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useSelector } from "react-redux";
import { IoSearch } from "react-icons/io5";

const Purchase = ({ companyDetails, isStaff }) => {
  const [purchases, setPurchases] = useState([]);
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
    const fetchPurchases = async () => {
      setLoading(true);
      try {
        const purchaseRef = collection(db, "companies", companyId, "purchases");
        const querySnapshot = await getDocs(purchaseRef);
        const purchasesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPurchases(purchasesData);
      } catch (error) {
        console.error("Error fetching purchases:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPurchases();
  }, [companyId]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusChange = async (purchaseId, newStatus) => {
    try {
      const purchaseDoc = doc(
        db,
        "companies",
        companyId,
        "purchases",
        purchaseId
      );
      await updateDoc(purchaseDoc, { paymentStatus: newStatus });
      setPurchases((prevPurchases) =>
        prevPurchases.map((purchase) =>
          purchase.id === purchaseId
            ? { ...purchase, paymentStatus: newStatus }
            : purchase
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const filteredPurchases = purchases.filter((purchase) => {
    const { vendorDetails, purchaseNo, paymentStatus } = purchase;
    const customerName = vendorDetails?.name || "";
    const matchesSearch =
      customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      purchaseNo?.toString().toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "All" || paymentStatus === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const totalAmount = filteredPurchases.reduce(
    (sum, purchase) => sum + purchase.total,
    0
  );

  const paidAmount = filteredPurchases
    .filter((purchase) => purchase.paymentStatus === "Paid")
    .reduce((sum, purchase) => sum + purchase.total, 0);
  const pendingAmount = filteredPurchases
    .filter((purchase) => purchase.paymentStatus === "Pending")
    .reduce((sum, purchase) => sum + purchase.total, 0);

  return (
    <div className="w-full">
      <div
        className="px-8 pb-8 pt-2 bg-gray-100 overflow-y-auto"
        style={{ height: "92vh" }}
      >
        <header className="flex items-center justify-between mb-3">
          <h1 className="text-2xl font-bold">Purchases</h1>
          <Link
            className="bg-blue-500 text-white py-1 px-2 rounded"
            to="create-purchase"
          >
            + Create Purchase
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
              placeholder="Search by transaction, customer, purchase #..."
              className=" w-full focus:outline-none"
              value={searchTerm}
              onChange={handleSearch}
            />
            <IoSearch />
          </div>

          {loading ? (
            <div className="text-center py-6">Loading purchases...</div>
          ) : (
            <div className="h-96 overflow-y-auto">
              <table className="w-full border-collapse  h-2/4">
                <thead className="sticky top-0 z-10 bg-white">
                  <tr className="border-b">
                    <th className="p-4">Vendor</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Mode</th>
                    <th className="p-4">purchase NO</th>
                    <th className="p-4">Date / Updated Time</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPurchases.length > 0 ? (
                    filteredPurchases.map((purchase) => (
                      <tr
                        key={purchase.id}
                        className="border-b text-center cursor-pointer"
                        onClick={(e) => {
                          navigate(purchase.id);
                        }}
                      >
                        <td className=" py-3">
                          {purchase.vendorDetails?.name} <br />
                          <span className="text-gray-500">
                            {purchase.vendorDetails?.phone}
                          </span>
                        </td>
                        <td className="py-3">{`₹ ${purchase.total.toFixed(
                          2
                        )}`}</td>
                        <td
                          className="py-3"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <select
                            value={purchase.paymentStatus}
                            onChange={(e) => {
                              handleStatusChange(purchase.id, e.target.value);
                            }}
                            className={`border p-1 rounded ${
                              purchase.paymentStatus === "Paid"
                                ? "bg-green-100 text-green-700"
                                : purchase.paymentStatus === "Pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Paid">Paid</option>
                            <option value="UnPaid">UnPaid</option>
                          </select>
                        </td>
                        <td className="py-3">{purchase.mode || "Online"}</td>
                        <td className="py-3">{purchase.purchaseNo}</td>

                        <td className="py-3">
                          {(() => {
                            if (
                              purchase.date &&
                              typeof purchase.date.seconds === "number"
                            ) {
                              const purchaseDate = new Date(
                                purchase.date.seconds * 1000
                              );
                              const today = new Date();
                              const timeDiff =
                                today.setHours(0, 0, 0, 0) -
                                purchaseDate.setHours(0, 0, 0, 0);
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
                        No purchases found
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

export default Purchase;
