import React, { useEffect, useRef, useState } from "react";
import { IoMdClose, IoMdDownload } from "react-icons/io";
import { RiDeleteBin6Line } from "react-icons/ri";
import { TbEdit } from "react-icons/tb";
import jsPDF from "jspdf";
import { FaRegEye } from "react-icons/fa";
import { db } from "../../../firebase";
import { useSelector } from "react-redux";
import Template from "../Template/Template";
import { doc, deleteDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
const DeliveryChallan = ({ deliveryChallan }) => {
  const navigate = useNavigate();
  const userDetails = useSelector((state) => state.users);
  const companyId =
    userDetails.companies[userDetails.selectedCompanyIndex].companyId;
  const [isDeliveryChallanOpen, setIsDeliveryChallanOpen] = useState(false);
  const [totalTax, setTotalTax] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);

  const deliveryChallanRef = useRef();

  useEffect(() => {
    if (deliveryChallan.products) {
      const tax = deliveryChallan?.products.reduce((acc, cur) => {
        return acc + cur?.tax;
      }, 0);
      const discount = deliveryChallan?.products.reduce((acc, cur) => {
        return acc + cur?.discount;
      }, 0);
      setTotalTax(tax);
      setTotalDiscount(discount);
    }
  }, [deliveryChallan]);

  const handleDownloadPdf = () => {
    if (!deliveryChallan.id) {
      return;
    }
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

  const handleDelete = async () => {
    try {
      if (!deliveryChallan.id || !companyId) {
        alert("deliveryChallan ID or Company ID is missing.");
        return;
      }

      const deliveryChallanDocRef = doc(
        db,
        "companies",
        companyId,
        "deliverychallan",
        deliveryChallan.id
      );

      const confirmDelete = window.confirm(
        "Are you sure you want to delete this DeliveryChallan?"
      );
      if (!confirmDelete) return;
      await deleteDoc(deliveryChallanDocRef);
      navigate("/delivery-challan");
    } catch (error) {
      console.error("Error deleting DeliveryChallan:", error);
      alert(
        "Failed to delete the DeliveryChallan. Check the console for details."
      );
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
  console.log("deliverychallan", deliveryChallan?.products);
  return (
    <div className="">
      <div className="p-3 flex justify-between bg-white rounded-lg my-3">
        <div className="space-x-4 flex">
          <button
            className={
              "px-4 py-1 bg-blue-300 text-white rounded-full flex items-center"
            }
            onClick={() => setIsDeliveryChallanOpen(true)}
          >
            <FaRegEye /> &nbsp; View
          </button>
          <button
            className={
              "px-4 py-1 bg-red-300 text-white rounded-full flex items-center"
            }
            onClick={() => navigate("edit-deliverychallan")}
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
        {deliveryChallan.paymentStatus !== "Paid" && (
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
            <div>Date: {DateFormate(deliveryChallan?.deliveryChallanDate)}</div>
          </div>
        </div>
        <div className="bg-white rounded-b-lg px-3 pb-3">
          {deliveryChallan?.products?.length > 0 &&
            deliveryChallan?.products.map((ele, index) => (
              <div key={index} className="flex justify-between border-b-2 py-3">
                <div>
                  <div className="text-lg font-bold">{ele.name}</div>
                  <div>-</div>
                  <div>Qty: {ele.quantity}</div>
                </div>
                <div className="text-end">
                  <div>Price: ₹{ele?.sellingPrice}</div>
                  <div>Tax :{ele?.tax}%</div>
                  <div>Discount :₹{ele?.discount}</div>
                </div>
              </div>
            ))}
          <div className="text-end border-b-2 border-dashed py-3">
            <div>subTotal: ₹{deliveryChallan.subTotal}</div>
            <div>Tax: {totalTax}%</div>
            <div>
              {deliveryChallan.extraDiscount?.amount > 0 && (
                <>
                  Extra Discount:{" "}
                  {deliveryChallan?.extraDiscount?.type === "percentage"
                    ? `${deliveryChallan.extraDiscount.amount}%`
                    : `₹${deliveryChallan.extraDiscount.amount}`}{" "}
                </>
              )}
            </div>
            <div>
              {" "}
              {deliveryChallan.packagingCharges > 0 && (
                <>Packaging Charges: ₹{deliveryChallan.packagingCharges}</>
              )}
            </div>
            <div>
              {" "}
              {deliveryChallan.shippingCharges > 0 && (
                <>Shipping Charges: ₹{deliveryChallan.shippingCharges} </>
              )}{" "}
            </div>
          </div>
          <div className="flex space-x-3 justify-end font-bold text-lg">
            <div>Total:</div>
            <div>₹ {deliveryChallan.total}</div>
          </div>
          <div className="bg-gray-100  rounded-lg">
            <div className="p-2">
              <div>Notes</div>
              <div className="font-bold">
                {deliveryChallan.notes || "No Data"}
              </div>
            </div>
            <hr />
            <div className="p-2">
              <div>Terms And Conditions</div>
              <div className="font-bold">
                {deliveryChallan.terms || "No Data"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {deliveryChallan.id && (
        <div
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
                <Template
                  ref={deliveryChallanRef}
                  deliveryChallanData={deliveryChallan}
                  //   bankDetails={bankDetails}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryChallan;
