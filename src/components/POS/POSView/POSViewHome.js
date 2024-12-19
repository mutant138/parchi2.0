import React, { useEffect, useRef, useState } from "react";
import { IoMdClose, IoMdDownload } from "react-icons/io";
import { RiDeleteBin6Line } from "react-icons/ri";
import { TbEdit } from "react-icons/tb";
import jsPDF from "jspdf";
import { FaRegEye } from "react-icons/fa";
import { db } from "../../../firebase";
import { useSelector } from "react-redux";
import { doc, deleteDoc, increment, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
function POSViewHome({ POS }) {
  const navigate = useNavigate();
  const userDetails = useSelector((state) => state.users);
  const companyId =
    userDetails.companies[userDetails.selectedCompanyIndex].companyId;
  const [isPOSOpen, setIsPOSOpen] = useState(false);
  const [totalTax, setTotalTax] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);

  const POSRef = useRef();

  useEffect(() => {
    if (POS.items) {
      const tax = POS?.items.reduce((acc, cur) => {
        return acc + cur?.tax;
      }, 0);
      const discount = POS?.items.reduce((acc, cur) => {
        return acc + cur?.amount;
      }, 0);
      setTotalTax(tax);
      setTotalDiscount(discount);
    }
  }, [POS]);
  const handleDownloadPdf = () => {
    if (!POS.id) {
      return;
    }
    const doc = new jsPDF("p", "pt", "a4");
    doc.html(POSRef.current, {
      callback: function (doc) {
        doc.save(`${POS.customerDetails?.name}'s POS.pdf`);
      },
      x: 0,
      y: 0,
    });
  };
  const handleDelete = async () => {
    try {
      if (!POS.id || !companyId) {
        alert("POS ID or Company ID is missing.");
        return;
      }

      // Ref to the POS document
      const POSDocRef = doc(db, "companies", companyId, "pos", POS.id);

      const confirmDelete = window.confirm(
        "Are you sure you want to delete this POS?"
      );
      if (!confirmDelete) return;
      await deleteDoc(POSDocRef);

      if (POS.items && POS.items.length > 0) {
        const updateInventoryPromises = POS.items.map((inventoryItem) => {
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
            "inventories",
            inventoryItem.productRef.id
          );

          return updateDoc(inventoryDocRef, {
            "stock.quantity": increment(inventoryItem.quantity),
          });
        });
        await Promise.all(updateInventoryPromises);
      }
      navigate("/pos");
    } catch (error) {
      console.error("Error deleting POS:", error);
      alert("Failed to delete the POS. Check the console for details.");
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
            onClick={() => setIsPOSOpen(true)}
          >
            <FaRegEye /> &nbsp; View
          </button>
          <button
            className={
              "px-4 py-1 bg-red-300 text-white rounded-full flex items-center"
            }
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
        {POS.paymentStatus !== "Paid" && (
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
            <div>Date: {DateFormate(POS?.date)}</div>
          </div>
        </div>
        <div className="bg-white rounded-b-lg px-3 pb-3">
          {POS?.items?.length > 0 &&
            POS.items.map((ele, index) => (
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
            <div>subTotal: ₹ {POS.subTotal}</div>
            <div>Discount: {totalDiscount}</div>
            <div>Tax: {totalTax}</div>
          </div>
          <div className="flex space-x-3 justify-end font-bold text-lg">
            <div>Total:</div>
            <div>₹ {POS.total}</div>
          </div>
          <div className="bg-gray-100  rounded-lg">
            <div className="p-2">
              <div>Notes</div>
              <div className="font-bold">{POS.notes || "No Data"}</div>
            </div>
            <hr />
            <div className="p-2">
              <div>Terms And Conditions</div>
              <div className="font-bold">{POS.terms || "No Data"}</div>
            </div>
          </div>
        </div>
      </div>

      {POS.id && (
        <div
          className="fixed inset-0 z-20 "
          onClick={() => setIsPOSOpen(false)}
          style={{ display: isPOSOpen ? "block" : "none" }}
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
                    onClick={() => setIsPOSOpen(false)}
                  >
                    <IoMdClose />
                    <div className="absolute left-1/2 transform -translate-x-1/2 top-8 px-1 py-1 bg-gray-600 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 z-200">
                      Close
                    </div>
                  </div>
                </div>
                {/* <Template1 ref={POSRef} invoiceData={POS} /> */}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default POSViewHome;
