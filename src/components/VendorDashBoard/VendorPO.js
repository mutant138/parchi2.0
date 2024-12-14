import React, { useState, useEffect } from "react";
import { IoMdDownload } from "react-icons/io";
import { db } from "../../firebase";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  where,
  Timestamp,
  getDoc,
} from "firebase/firestore";
import { useSelector } from "react-redux";

const VendorPO = () => {
  const [loading, setLoading] = useState(false);
  const [companiesDetails, setCompaniesDetails] = useState([]);

  const userDetails = useSelector((state) => state.users);
  const phone = userDetails.phone;
  const companyDetails =
    userDetails.companies[userDetails.selectedCompanyIndex];

  const fetchVendorAndCompaniesData = async () => {
    setLoading(true);
    try {
      const normalizedPhone = phone.startsWith("+91") ? phone.slice(3) : phone;
      const vendorQuery = query(
        collection(db, "vendors"),
        where("phone", "==", normalizedPhone)
      );
      const vendorSnapshot = await getDocs(vendorQuery);

      if (vendorSnapshot.empty) {
        console.error("No vendor found with the provided phone number");
        setCompaniesDetails([]);
        setLoading(false);
        return;
      }

      const companyRefs = vendorSnapshot.docs.map(
        (doc) => doc.data().companyRef
      );

      const companiesData = await Promise.all(
        companyRefs.map(async (companyRef) => {
          const companyDoc = await getDoc(companyRef);
          if (!companyDoc.exists()) {
            return null;
          }
          const companyData = { ...companyDoc.data(), id: companyDoc.id };

          const purchasesQuery = query(
            collection(companyRef, "purchases"),
            where("phone", "==", phone)
          );
          const purchasesSnapshot = await getDocs(purchasesQuery);

          const purchases = purchasesSnapshot.docs.map((purchaseDoc) => ({
            id: purchaseDoc.id,
            ...purchaseDoc.data(),
          }));

          return { ...companyData, purchases };
        })
      );

      setCompaniesDetails(companiesData);
    } catch (error) {
      console.error("Error fetching vendor and companies data:", error);
    } finally {
      setLoading(false);
    }
  };
  console.log("companyDetails", companiesDetails);
  useEffect(() => {
    fetchVendorAndCompaniesData();
  }, [phone, companyDetails]);

  return (
    <div className="w-full">
      <div
        className="px-8 pb-8 pt-2 bg-gray-100 overflow-y-auto"
        style={{ height: "92vh" }}
      >
        <header className="flex items-center justify-between mb-3">
          <h1 className="text-2xl font-bold">PO</h1>
        </header>
        <div className="bg-white p-4 rounded-lg shadow mb-4">
          {loading ? (
            <div className="text-center py-6">Loading PO...</div>
          ) : (
            <div className="overflow-y-auto" style={{ height: "70vh" }}>
              <table className="w-full border-collapse  h-28 text-center">
                <thead className="sticky top-0 z-10 bg-white">
                  <tr className="border-b">
                    <th className="p-4">Company Name</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Mode</th>
                    <th className="p-4">PO NO</th>
                    <th className="p-4">Date / Updated Time</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {companiesDetails.length > 0 ? (
                    companiesDetails.map((po) => (
                      <tr key={po.id} className="border-b text-center">
                        <td className="py-3">
                          {po.customerDetails?.name} <br />
                          <span className="text-gray-500">
                            {po.customerDetails.phone}
                          </span>
                        </td>
                        <td className="py-3">{`₹ ${po.total.toFixed(2)}`}</td>
                        <td className="py-3">{po.paymentStatus}</td>
                        <td className="py-3">{po.mode || "Online"}</td>
                        <td className="py-3">{po.poNo}</td>

                        <td className="py-3">
                          {(() => {
                            if (
                              po.poDate.seconds &&
                              typeof po.poDate.seconds === "number"
                            ) {
                              const date = new Date(po.poDate.seconds * 1000);
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

                        <td className="py-3 space-x-2">
                          <button className="relative group text-green-500 hover:text-green-700 text-xl">
                            <IoMdDownload />
                            <div className="absolute left-1/2 transform -translate-x-1/2 top-5 px-2 py-1 bg-gray-600 text-white text-xs rounded-md opacity-0 group-hover:opacity-100">
                              Download
                            </div>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-4">
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
};

export default VendorPO;
