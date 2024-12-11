import React, { useEffect, useRef, useState } from "react";
import Invoice from "./Invoice";
import Returns from "./Returns";
import { Link, useParams } from "react-router-dom";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useSelector } from "react-redux";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import jsPDF from "jspdf";

function InvoiceView() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("Invoice");
  const [invoice, setInvoice] = useState({});
  const userDetails = useSelector((state) => state.users);
  const [bankDetails, setBankDetails] = useState({});

  const companyId =
    userDetails.companies[userDetails.selectedCompanyIndex].companyId;

  const fetchInvoices = async () => {
    try {
      const invoiceRef = doc(db, "companies", companyId, "invoices", id);
      const resData = await getDoc(invoiceRef);
      const invoicesData = {
        id: resData.id,
        ...resData.data(),
      };
      const bankData = (await getDoc(invoicesData.book.bookRef)).data();
      setBankDetails(bankData);
      setInvoice(invoicesData);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    }
  };
  useEffect(() => {
    fetchInvoices();
  }, [companyId]);

  return (
    <div className="px-5 pb-5 bg-gray-100" style={{ width: "100%" }}>
      <header className="flex items-center space-x-3 my-2 ">
        <Link
          className="flex items-center bg-gray-300 text-gray-700 py-1 px-4 rounded-full transform hover:bg-gray-400 hover:text-white transition duration-200 ease-in-out"
          to="/invoiceList"
        >
          <AiOutlineArrowLeft className="w-5 h-5 mr-2" />
        </Link>
        <h1 className="text-2xl font-bold">{invoice.invoiceNo}</h1>
      </header>
      <hr />
      <div>
        <nav className="flex space-x-4 mt-3 mb-3">
          <button
            className={
              "px-4 py-1" +
              (activeTab === "Invoice"
                ? " bg-blue-700 text-white rounded-full"
                : "")
            }
            onClick={() => setActiveTab("Invoice")}
          >
            Invoice View
          </button>
          <button
            className={
              "px-4 py-1" +
              (activeTab === "Returns"
                ? " bg-blue-700 text-white rounded-full"
                : "")
            }
            onClick={() => setActiveTab("Returns")}
          >
            Returns
          </button>
        </nav>
      </div>
      <hr />
      <div className="w-full">
        {activeTab === "Invoice" && (
          <div>
            <Invoice invoice={invoice} bankDetails={bankDetails} />
          </div>
        )}
        {activeTab === "Returns" && (
          <div>
            <Returns />
          </div>
        )}
      </div>
    </div>
  );
}

export default InvoiceView;
