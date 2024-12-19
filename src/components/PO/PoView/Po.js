import React, { useEffect, useRef, useState } from "react";
import { IoMdClose, IoMdDownload } from "react-icons/io";
import { RiDeleteBin6Line } from "react-icons/ri";
import { TbEdit } from "react-icons/tb";
import jsPDF from "jspdf";
import { FaRegEye } from "react-icons/fa";
import { db , storage} from "../../../firebase";
import {  ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useSelector } from "react-redux";
import Template from "../Template/Template";
import { doc, deleteDoc, increment, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
function Po({ Po, bankDetails }) {
  const navigate = useNavigate();
  const userDetails = useSelector((state) => state.users);
  const companyId =
    userDetails.companies[userDetails.selectedCompanyIndex].companyId;
  const [isPoOpen, setIsPoOpen] = useState(false);
  const [totalTax, setTotalTax] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  console.log("Po", Po);
  const poRef = useRef();

  useEffect(() => {
    if (Po.products) {
      const tax = Po?.products.reduce((acc, cur) => {
        return acc + cur?.tax;
      }, 0);
      const discount = Po?.products.reduce((acc, cur) => {
        return acc + cur?.discount;
      }, 0);
      setTotalTax(tax);
      setTotalDiscount(discount);
    }
  }, [Po]);

  const handleDownloadPdf = () => {
    if (!Po.id) {
      return;
    }
    const doc = new jsPDF("p", "pt", "a4");
    doc.html(poRef.current, {
      callback: function (doc) {
        doc.save(`${Po.vendorDetailsname}'s Po.pdf`);
      },
      x: 0,
      y: 0,
    });
  };

  const handleWhatsAppShare = async () => {
    if (!Po.id) {
      console.error("Po ID is missing!");
      return;
    }
  
    try {
      // Generate the PDF in-memory
      const doc = new jsPDF("p", "pt", "a4");
      doc.html(poRef.current, {
        callback: async function (doc) {
          const pdfBlob = doc.output("blob");
  
          // Create a reference to the file in Firebase Storage
          const fileName = `Pos/${Po.id}.pdf`;
          const fileRef = ref(storage, fileName);
  
          // Upload the file
          await uploadBytes(fileRef, pdfBlob);
  
          // Generate a public download URL
          const downloadURL = await getDownloadURL(fileRef);
  
          // Share the public link via WhatsApp
          const message = `Here is your Po for ${Po.vendorDetailsname}: ${downloadURL}`;
          window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`, "_blank");
        },
        x: 0,
        y: 0,
      });
    } catch (error) {
      console.error("Error uploading or sharing the PDF:", error);
    }
  };
  
  

  const handleEmailShare = async () => {
    if (!Po.id) {
      console.error("Po ID is missing!");
      return;
    }
  
    try {
      // Generate the PDF in-memory
      const doc = new jsPDF("p", "pt", "a4");
      doc.html(poRef.current, {
        callback: async function (doc) {
          const pdfBlob = doc.output("blob");
  
          // Create a reference to the file in Firebase Storage
          const fileName = `Pos/${Po.id}.pdf`;
          const fileRef = ref(storage, fileName);
  
          // Upload the file to Firebase Storage
          await uploadBytes(fileRef, pdfBlob);
  
          // Generate a public download URL
          const downloadURL = await getDownloadURL(fileRef);
  
          // Construct the email subject and body
          const subject = `Po for ${Po.vendorDetailsname}`;
          const body = `Hi ${Po.vendorDetailsname},%0D%0A%0D%0AHere is your Po for the recent purchase.%0D%0A%0D%0AYou can download it here: ${downloadURL}`;
  
          // Open the default email client with pre-filled subject and body
          window.location.href = `mailto:?subject=${subject}&body=${body}`;
        },
        x: 0,
        y: 0,
      });
    } catch (error) {
      console.error("Error uploading or sharing the PDF:", error);
    }
  };
  

  const handleDelete = async () => {
    try {
      if (!Po.id || !companyId) {
        alert("Po ID or Company ID is missing.");
        return;
      }

      const PoDocRef = doc(
        db,
        "companies",
        companyId,
        "purchases",
        Po.id
      );

      const confirmDelete = window.confirm(
        "Are you sure you want to delete this Po?"
      );
      if (!confirmDelete) return;
      await deleteDoc(PoDocRef);

      if (Po.products && Po.products.length > 0) {
        const updateInventoryPromises = Po.products.map(
          (inventoryItem) => {
            console.log("inventoryitem", inventoryItem);
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
              stock: increment(-inventoryItem.quantity),
            });
          }
        );
        await Promise.all(updateInventoryPromises);
      }
      navigate("/po");
    } catch (error) {
      console.error("Error deleting Po:", error);
      alert("Failed to delete the Po. Check the console for details.");
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
  console.log("Po", Po?.products);
  return (
    <div className="">
      <div className="p-3 flex justify-between bg-white rounded-lg my-3">
        <div className="space-x-4 flex">
          <button
            className={
              "px-4 py-1 bg-blue-300 text-white rounded-full flex items-center"
            }
            onClick={() => setIsPoOpen(true)}
          >
            <FaRegEye /> &nbsp; View
          </button>
          <button
            className={
              "px-4 py-1 bg-red-300 text-white rounded-full flex items-center"
            }
            onClick={() => navigate("edit-po")}
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
        {Po.orderStatus !== "Received" && (
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
            <div>Date: {DateFormate(Po?.poDate)}</div>
          </div>
        </div>
        <div className="bg-white rounded-b-lg px-3 pb-3">
          {Po?.products?.length > 0 &&
            Po?.products.map((ele, index) => (
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
            <div>subTotal: ₹{Po.subTotal}</div>
            <div>Tax: {totalTax}%</div>
            <div>
              {Po.extraDiscount?.amount > 0 && (
                <>
                  Extra Discount:{" "}
                  {Po?.extraDiscount?.type === "percentage"
                    ? `${Po.extraDiscount.amount}%`
                    : `₹${Po.extraDiscount.amount}`}{" "}
                </>
              )}
            </div>
            <div>
              {" "}
              {Po.packagingCharges > 0 && (
                <>Packaging Charges: ₹{Po.packagingCharges}</>
              )}
            </div>
            <div>
              {" "}
              {Po.shippingCharges > 0 && (
                <>Shipping Charges: ₹{Po.shippingCharges} </>
              )}{" "}
            </div>
          </div>
          <div className="flex space-x-3 justify-end font-bold text-lg">
            <div>Total:</div>
            <div>₹ {Po.total}</div>
          </div>
          <div className="bg-gray-100  rounded-lg">
            <div className="p-2">
              <div>Notes</div>
              <div className="font-bold">{Po.notes || "No Data"}</div>
            </div>
            <hr />
            <div className="p-2">
              <div>Terms And Conditions</div>
              <div className="font-bold">{Po.terms || "No Data"}</div>
            </div>
          </div>
        </div>
      </div>

      {Po.id && (
        <div
          className="fixed inset-0 z-20 "
          onClick={() => setIsPoOpen(false)}
          style={{ display: isPoOpen ? "block" : "none" }}
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
                    onClick={() => setIsPoOpen(false)}
                  >
                    <IoMdClose />
                    <div className="absolute left-1/2 transform -translate-x-1/2 top-8 px-1 py-1 bg-gray-600 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 z-200">
                      Close
                    </div>
                  </div>
                </div>
                <Template
                  ref={poRef}
                  poData={Po}
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

export default Po;
