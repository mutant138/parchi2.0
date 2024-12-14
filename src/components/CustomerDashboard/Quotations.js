import React, { useState } from "react";
import { IoMdDownload } from "react-icons/io";

function Quotations() {
  const [loading, setLoading] = useState(false);
  const [invoices, setInvoices] = useState([
    {
      id: "nblgUcPKNPWfbcmZsHEj",
      tax: 0,
      mode: "Cash",
      terms: "",
      dueDate: {
        seconds: 1734151343,
        nanoseconds: 875000000,
      },
      invoiceDate: {
        seconds: 1734151343,
        nanoseconds: 875000000,
      },
      book: {},
      packagingCharges: 0,
      products: [
        {
          name: "notebook",
          sellingPriceTaxType: false,
          tax: 5,
          discountType: true,
          productRef: {},
          purchasePrice: 80,
          discount: 20,
          quantity: 1,
          sellingPrice: 200,
          purchasePriceTaxType: false,
          description: "notes...",
        },
      ],
      tcs: {
        type_of_goods: "",
        tax_value: 0,
        tcs_amount: 0,
        tax: "",
        isTcsApplicable: false,
      },
      notes: "",
      attachments: [],
      customerDetails: {
        name: "cust4",
        phone: "123456779",
        zipCode: "234567",
        city: "xcvb",
        gstNumber: "345678",
        address: "asdfghjk",
        customerRef: {},
      },
      total: 189,
      subTotal: 180,
      shippingCharges: 0,
      createdBy: {
        zipCode: "",
        address: "",
        companyRef: {},
        name: "kayu",
        phoneNo: "+911234567890",
        city: "",
      },
      invoiceNo: "0001",
      paymentStatus: "UnPaid",
      tds: {
        percentageValue: "",
        tdsSection: "",
        natureOfPayment: "",
        isTdsApplicable: false,
        percentage: 0,
        tds_amount: 0,
      },
      discount: 0,
    },
  ]);

  return (
    <div className="w-full">
      <div
        className="px-8 pb-8 pt-2 bg-gray-100 overflow-y-auto"
        style={{ height: "92vh" }}
      >
        <header className="flex items-center justify-between mb-3">
          <h1 className="text-2xl font-bold">Invoices</h1>
        </header>
        <div className="bg-white p-4 rounded-lg shadow mb-4">
          {loading ? (
            <div className="text-center py-6">Loading invoices...</div>
          ) : (
            <div className="overflow-y-auto" style={{ height: "70vh" }}>
              <table className="w-full border-collapse  h-28 text-center">
                <thead className="sticky top-0 z-10 bg-white">
                  <tr className="border-b">
                    <th className="p-4">Customer</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Mode</th>
                    <th className="p-4">Invoice NO</th>
                    <th className="p-4">Date / Updated Time</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.length > 0 ? (
                    invoices.map((invoice) => (
                      <tr key={invoice.id} className="border-b text-center">
                        <td className="py-3">
                          {invoice.customerDetails?.name} <br />
                          <span className="text-gray-500">
                            {invoice.customerDetails.phone}
                          </span>
                        </td>
                        <td className="py-3">{`₹ ${invoice.total.toFixed(
                          2
                        )}`}</td>
                        <td className="py-3">{invoice.paymentStatus}</td>
                        <td className="py-3">{invoice.mode || "Online"}</td>
                        <td className="py-3">{invoice.invoiceNo}</td>

                        <td className="py-3">
                          {(() => {
                            if (
                              invoice.invoiceDate.seconds &&
                              typeof invoice.invoiceDate.seconds === "number"
                            ) {
                              const date = new Date(
                                invoice.invoiceDate.seconds * 1000
                              );
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
                        No invoices found
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
}

export default Quotations;
