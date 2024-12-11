import React, { useEffect, useRef, useState } from "react";
import { IoMdClose, IoMdDownload } from "react-icons/io";
import { RiDeleteBin6Line } from "react-icons/ri";
import { TbEdit } from "react-icons/tb";
import jsPDF from "jspdf";
import { FaRegEye } from "react-icons/fa";
import { db } from "../../../firebase";
import { useSelector } from "react-redux";
import Template1 from "../Templates/Template1";
import { doc, deleteDoc, increment, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
function Invoice({ invoice, bankDetails }) {
  const navigate = useNavigate();
  const userDetails = useSelector((state) => state.users);
  const companyId =
    userDetails.companies[userDetails.selectedCompanyIndex].companyId;
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [totalTax, setTotalTax] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);

  const invoiceRef = useRef();

  useEffect(() => {
    if (invoice.items) {
      const tax = invoice?.items.reduce((acc, cur) => {
        return acc + cur.pricing?.sellingPrice.taxSlab;
      }, 0);
      const discount = invoice?.items.reduce((acc, cur) => {
        return acc + cur.pricing?.discount.amount;
      }, 0);
      setTotalTax(tax);
      setTotalDiscount(discount);
    }
  }, [invoice]);
  const handleDownloadPdf = () => {
    if (!invoice.id) {
      return;
    }
    const doc = new jsPDF("p", "pt", "a4");
    doc.html(invoiceRef.current, {
      callback: function (doc) {
        doc.save(`${invoice.customerDetails.name}'s invoice.pdf`);
      },
      x: 0,
      y: 0,
    });
  };
  const handleDelete = async () => {
    try {
      if (!invoice.id || !companyId) {
        alert("Invoice ID or Company ID is missing.");
        return;
      }

      // Ref to the invoice document
      const invoiceDocRef = doc(
        db,
        "companies",
        companyId,
        "invoices",
        invoice.id
      );

      const confirmDelete = window.confirm(
        "Are you sure you want to delete this invoice?"
      );
      if (!confirmDelete) return;
      await deleteDoc(invoiceDocRef);

      if (invoice.items && invoice.items.length > 0) {
        const updateInventoryPromises = invoice.items.map((inventoryItem) => {
          if (
            !inventoryItem.productRef ||
            typeof inventoryItem.quantity !== "number"
          ) {
            console.error("Invalid inventory item:", inventoryItem);
            return Promise.resolve();
          }

          const inventoryDocRef = doc(
            db,
            "companies",
            companyId,
            "products",
            inventoryItem.productRef.id
          );

          return updateDoc(inventoryDocRef, {
            "stock.quantity": increment(inventoryItem.quantity),
          });
        });
        await Promise.all(updateInventoryPromises);
      }
      navigate("/invoiceList");
    } catch (error) {
      console.error("Error deleting invoice:", error);
      alert("Failed to delete the invoice. Check the console for details.");
    }
  };

  function DateFormate(timestamp) {
    if (!timestamp) {
      return;
    }
    const milliseconds =
      timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000;
    const date = new Date(milliseconds);
    const getDate = String(date.getDate()).padStart(2, "0");
    const getMonth = String(date.getMonth() + 1).padStart(2, "0");
    const getFullYear = date.getFullYear();

    return `${getDate}/${getMonth}/${getFullYear}`;
  }

  return (
    <div className="">
      <div className="p-3 flex justify-between bg-white rounded-lg my-3">
        <div className="space-x-4 flex">
          <button
            className={
              "px-4 py-1 bg-blue-300 text-white rounded-full flex items-center"
            }
            onClick={() => setIsInvoiceOpen(true)}
          >
            <FaRegEye /> &nbsp; View
          </button>
          <button
            className={
              "px-4 py-1 bg-red-300 text-white rounded-full flex items-center"
            }
            onClick={() => navigate("edit-invoice")}
          >
            <TbEdit /> &nbsp; Edit
          </button>
          <button
            className={
              "px-4 py-1 bg-green-500 text-white rounded-full flex items-center"
            }
            onClick={handleDownloadPdf}
          >
            <IoMdDownload /> &nbsp; download
          </button>
        </div>
        {invoice.paymentStatus !== "Paid" && (
          <div className="text-end">
            <button
              className={"px-4 py-1 text-red-700 text-2xl"}
              onClick={handleDelete}
            >
              <RiDeleteBin6Line />
            </button>
          </div>
        )}
      </div>
      <div className="space-y-2 ">
        <div className="bg-white rounded-t-lg p-3 py-2">
          <div>
            <div>
              <div></div>
              <div>
                <div>Bill To</div>
                <div></div>
                <div></div>
              </div>
            </div>
            <div>Date: {DateFormate(invoice?.date)}</div>
          </div>
        </div>
        <div className="bg-white rounded-b-lg px-3 pb-3">
          {invoice?.items?.length > 0 &&
            invoice.items.map((ele, index) => (
              <div key={index} className="flex justify-between border-b-2 py-3">
                <div>
                  <div className="text-lg font-bold">{ele.name}</div>
                  <div>-</div>
                  <div>Qty: {ele.quantity}</div>
                </div>
                <div className="text-end">
                  <div>Price: ₹ {ele.pricing.sellingPrice.amount}</div>
                  <div>Tax :{ele.pricing.sellingPrice.taxSlab}</div>
                  <div>Discount :{ele.pricing.discount.amount}</div>
                </div>
              </div>
            ))}
          <div className="text-end border-b-2 border-dashed py-3">
            <div>subTotal: ₹ {invoice.subTotal}</div>
            <div>Discount: {totalDiscount}</div>
            <div>Tax: {totalTax}</div>
          </div>
          <div className="flex space-x-3 justify-end font-bold text-lg">
            <div>Total:</div>
            <div>₹ {invoice.total}</div>
          </div>
          <div className="bg-gray-100  rounded-lg">
            <div className="p-2">
              <div>Notes</div>
              <div className="font-bold">{invoice.notes || "No Data"}</div>
            </div>
            <hr />
            <div className="p-2">
              <div>Terms And Conditions</div>
              <div className="font-bold">{invoice.terms || "No Data"}</div>
            </div>
          </div>
        </div>
      </div>

      {invoice.id && (
        <div
          className="fixed inset-0 z-20 "
          onClick={() => setIsInvoiceOpen(false)}
          style={{ display: isInvoiceOpen ? "block" : "none" }}
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
                    onClick={() => setIsInvoiceOpen(false)}
                  >
                    <IoMdClose />
                    <div className="absolute left-1/2 transform -translate-x-1/2 top-8 px-1 py-1 bg-gray-600 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 z-200">
                      Close
                    </div>
                  </div>
                </div>
                <Template1
                  ref={invoiceRef}
                  invoiceData={invoice}
                  bankDetails={bankDetails}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Invoice;
