import React, { useEffect, useRef, useState } from "react";
import { IoMdClose, IoMdDownload } from "react-icons/io";
import { RiDeleteBin6Line } from "react-icons/ri";
import { TbEdit } from "react-icons/tb";
import jsPDF from "jspdf";
import { FaRegEye } from "react-icons/fa";
import { db, storage } from "../../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useSelector } from "react-redux";
import Template1 from "../Templates/Template1";
import { doc, deleteDoc, increment, updateDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import SunyaLogo from "../../../assets/SunyaLogo.jpg";

function Invoice({ invoice, bankDetails }) {
  const navigate = useNavigate();
  const userDetails = useSelector((state) => state.users);
  console.log("🚀 ~ Invoice ~ userDetails:", userDetails);
  const companyId =
    userDetails.companies[userDetails.selectedCompanyIndex].companyId;
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [totalTax, setTotalTax] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  console.log("invoice", invoice);
  const invoiceRef = useRef();

  useEffect(() => {
    if (invoice.products) {
      const tax = invoice?.products.reduce((acc, cur) => {
        return acc + cur?.tax;
      }, 0);
      const discount = invoice?.products.reduce((acc, cur) => {
        return acc + cur?.discount;
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

  const handleWhatsAppShare = async () => {
    if (!invoice.id) {
      console.error("Invoice ID is missing!");
      return;
    }

    try {
      // Generate the PDF in-memory
      const doc = new jsPDF("p", "pt", "a4");
      doc.html(invoiceRef.current, {
        callback: async function (doc) {
          const pdfBlob = doc.output("blob");

          // Create a reference to the file in Firebase Storage
          const fileName = `invoices/${invoice.id}.pdf`;
          const fileRef = ref(storage, fileName);

          // Upload the file
          await uploadBytes(fileRef, pdfBlob);

          // Generate a public download URL
          const downloadURL = await getDownloadURL(fileRef);

          // Share the public link via WhatsApp
          const message = `Here is your invoice for ${invoice.customerDetails.name}: ${downloadURL}`;
          window.open(
            `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`,
            "_blank"
          );
        },
        x: 0,
        y: 0,
      });
    } catch (error) {
      console.error("Error uploading or sharing the PDF:", error);
    }
  };

  const handleEmailShare = async () => {
    if (!invoice.id) {
      console.error("Invoice ID is missing!");
      return;
    }

    try {
      // Generate the PDF in-memory
      const doc = new jsPDF("p", "pt", "a4");
      doc.html(invoiceRef.current, {
        callback: async function (doc) {
          const pdfBlob = doc.output("blob");

          // Create a reference to the file in Firebase Storage
          const fileName = `invoices/${invoice.id}.pdf`;
          const fileRef = ref(storage, fileName);

          // Upload the file to Firebase Storage
          await uploadBytes(fileRef, pdfBlob);

          // Generate a public download URL
          const downloadURL = await getDownloadURL(fileRef);

          // Construct the email subject and body
          const subject = `Invoice for ${invoice.customerDetails.name}`;
          const body = `Hi ${invoice.customerDetails.name},%0D%0A%0D%0AHere is your invoice for the recent purchase.%0D%0A%0D%0AYou can download it here: ${downloadURL}`;

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
      if (!invoice.id || !companyId) {
        alert("Invoice ID or Company ID is missing.");
        return;
      }

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

      if (invoice.products && invoice.products.length > 0) {
        const updateInventoryPromises = invoice.products.map(
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
              stock: increment(inventoryItem.quantity),
            });
          }
        );
        await Promise.all(updateInventoryPromises);
      }
      navigate("/invoice");
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
  console.log("invoice", invoice?.products);
  const columns = [
    {
      id: 1,
      label: "NAME",
    },
    {
      id: 2,
      label: "QUANTITY",
    },
    {
      id: 3,
      label: "DISCOUNT",
    },
    {
      id: 4,
      label: "TAX",
    },
    {
      id: 5,
      label: "PRICE",
    },
  ];

  return (
    <div>
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
          <button
            className="px-4 py-1 bg-green-400 text-white rounded-full flex items-center"
            onClick={handleWhatsAppShare}
          >
            Share on WhatsApp
          </button>
          <button
            className="px-4 py-1 bg-gray-500 text-white rounded-full flex items-center"
            onClick={handleEmailShare}
          >
            Share via Email
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
      <div className="grid grid-cols-12 gap-6 mt-6">
        <div className="col-span-12 ">
          <div className="p-5 bg-white rounded-lg my-3">
            <div className="">
              <div className="flex gap-6 flex-col md:flex-row pt-8">
                <div className="flex-1">
                  <Link href="#">
                    <img src={SunyaLogo} width={100} alt="logo" height={100} />
                    <span className="text-3xl font-bold text-primary-600">
                      Sunya
                    </span>
                  </Link>
                  <div className="mt-5">
                    <div className="text-lg font-semibold text-gray-900">
                      Billing To:
                    </div>
                    <div className="text-lg  text-gray-800 mt-1">
                      {invoice.customerDetails?.name}
                    </div>
                    <div className=" text-gray-600 mt-2">
                      {invoice.customerDetails?.address} <br />
                      {invoice.customerDetails?.city} <br />
                      {invoice.customerDetails?.zipCode} <br />
                    </div>
                  </div>
                </div>
                <div className="flex-none md:text-end">
                  <div className="text-4xl font-semibold text-gray-900">
                    Invoice #
                  </div>
                  <div className="mt-1.5 text-xl  text-gray-600">
                    {invoice.invoiceNo}
                  </div>
                  <div className="mt-4  text-gray-600">
                    {invoice.createdBy?.name} <br />
                    {invoice.createdBy?.address} <br />
                    {invoice.createdBy?.city} <br />
                    {invoice.createdBy?.zipCode} <br />
                  </div>
                  <div className="mt-8">
                    <div className="mb-2.5">
                      <span className="mr-12  font-semibold text-gray-900">
                        Invoice Date:
                      </span>
                      <span className="  text-gray-600">
                        {DateFormate(invoice?.invoiceDate)}
                      </span>
                    </div>
                    <div>
                      <span className="mr-12  font-semibold text-gray-900">
                        Due Date:
                      </span>
                      <span className="  text-gray-600">
                        {DateFormate(invoice?.dueDate)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 border-2  rounded-lg">
                <table className="w-full ">
                  <thead>
                    <tr className="border-b-2 [&_th:last-child]:text-end">
                      {columns.map((column) => (
                        <th
                          key={`invoice-table-${column.id}`}
                          className="text-start p-3 "
                        >
                          {column.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="[&_tr:last-child]:border-1 ">
                    {invoice?.products?.length > 0 &&
                      invoice?.products.map((item) => (
                        <tr
                          key={`invoice-description-${item.id}`}
                          className="border-b-2 p-3 [&_td:last-child]:text-end"
                        >
                          <td className="  text-gray-600 max-w-[200px] truncate p-3">
                            {item.name}
                          </td>
                          <td className="  text-gray-600 p-3">
                            {item.quantity} pcs
                          </td>
                          <td className="  text-gray-600 whitespace-nowrap p-3">
                            {item.discount}
                          </td>
                          <td className="  text-gray-600 whitespace-nowrap p-3">
                            {item.tax}%
                          </td>
                          <td className="ltr:text-right rtl:text-left   text-gray-600 p-3">
                            ₹{item.sellingPrice}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                <div className="mt-2 flex justify-end  p-6">
                  <div>
                    {[
                      {
                        label: "Sub Total",
                        amount: invoice.subTotal,
                      },
                      {
                        label: "Extra Discount",
                        amount:
                          invoice?.extraDiscountType === "percentage"
                            ? `${invoice?.extraDiscount || 0}%`
                            : `₹${invoice?.extraDiscount || 0}`,
                      },
                      {
                        label: "TAX(%)",
                        amount: invoice.tax,
                      },
                      {
                        label: "Shipping",
                        amount: "₹" + invoice.shippingCharges,
                      },
                      {
                        label: "Packaging",
                        amount: "₹" + invoice.packagingCharges,
                      },
                      {
                        label: "total",
                        amount: invoice.total,
                      },
                    ].map((item, index) => (
                      <div
                        key={`invoice-item-${index}`}
                        className="mb-3 text-end flex justify-end"
                      >
                        <span className="  text-gray-600 ">{item.label}:</span>
                        <span className="  text-gray-600  text-end w-[100px] md:w-[160px] block">
                          {item.amount}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="  text-gray-600 mt-6">Note:</div>
              <div className=" text-gray-800">
                {invoice.notes || "No notes"}
              </div>
              <div className="mt-3.5   text-gray-600">Terms & Conditions:</div>
              <div className=" text-gray-800 mt-1">
                {invoice.terms || "No Terms and Conditions"}
              </div>
              <div className="mt-6 text-lg font-semibold text-gray-900">
                Thank You!
              </div>
              <div className="mt-1  text-gray-800">
                If you have any questions concerning this invoice, use the
                following contact information:
              </div>
              <div className="text-xs text-gray-800 mt-2">
                {userDetails.email}
              </div>
              <div className="text-xs text-gray-800 mt-1">
                {userDetails.phone}
              </div>
              <div className="mt-8 text-xs text-gray-800">© 2024 Sunya</div>
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

  //         <div className="text-end border-b-2 border-dashed py-3">
  //           <div>subTotal: ₹{invoice.subTotal}</div>
  //           <div>Tax: {totalTax}%</div>

  //           <div>
  //             {" "}
  //             {invoice.packagingCharges > 0 && (
  //               <>Packaging Charges: ₹{invoice.packagingCharges}</>
  //             )}
  //           </div>
  //           <div>
  //             {" "}
  //             {invoice.shippingCharges > 0 && (
  //               <>Shipping Charges: ₹{invoice.shippingCharges} </>
  //             )}{" "}
  //           </div>
  //         </div>
  //         <div className="flex space-x-3 justify-end font-bold text-lg">
  //           <div>Total:</div>
  //           <div>₹ {invoice.total}</div>
  //         </div>
  //         <div className="bg-gray-100  rounded-lg">
  //           <div className="p-2">
  //             <div>Notes</div>
  //             <div className="font-bold">{invoice.notes || "No Data"}</div>
  //           </div>
  //           <hr />
  //           <div className="p-2">
  //             <div>Terms And Conditions</div>
  //             <div className="font-bold">{invoice.terms || "No Data"}</div>
  //           </div>
  //         </div>
  //       </div>
  //     </div>

  //   </div>
  // );
}

export default Invoice;
