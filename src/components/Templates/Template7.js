import React, { forwardRef } from "react";

const Template7 = forwardRef((props, ref) => {
  const { invoiceData, bankDetails } = props;
  if (!invoiceData) {
    return;
  }
  function DateFormate(timestamp) {
    const milliseconds =
      timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000;
    const date = new Date(milliseconds);
    const getDate = String(date.getDate()).padStart(2, "0");
    const getMonth = String(date.getMonth() + 1).padStart(2, "0");
    const getFullYear = date.getFullYear();

    return `${getDate}.${getMonth}.${getFullYear}`;
  }
  return (
    <div
      className=" bg-white border border-gray-300 rounded-md shadow-md overflow-y-auto"
      style={{ height: "80vh" }}
    >
      <div ref={ref} style={{ width: "595px", padding: "20px" }}>
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-4">
          <div>
            <h1 className=" text-gray-800">
              <span className="font-bold">Invoice No:</span> #{invoiceData.no}
            </h1>
            <p className="text-gray-600">
              <span className="font-bold"> Date:</span>{" "}
              {DateFormate(invoiceData.dueDate)}
            </p>
          </div>
          <h1 className="text-3xl font-bold text-green-500">
            {invoiceData?.createdBy?.name}
          </h1>
          {/* <img src="/ivonne-logo.png" alt="Ivonne Logo" className="h-12" /> */}
        </div>

        {/* Billing & Pay To Section */}
        <div className="grid grid-cols-2 gap-6 mt-6 text-sm text-gray-800">
          <div>
            <h3 className="font-bold">Invoice To:</h3>
            <p>{invoiceData?.userTo?.name}</p>
            <p>
              {invoiceData.userTo.address}
              {invoiceData.userTo.city}
              {invoiceData.userTo.zipCode}
            </p>
            <p>{invoiceData.userTo.phone}</p>
            <p>{invoiceData.userTo.email}</p>
          </div>
          <div className="text-right">
            <h3 className="font-bold">Pay To:</h3>
            <p> {invoiceData?.createdBy?.name}</p>
            <p>
              {invoiceData.createdBy.address}
              {invoiceData.createdBy.city}
              {invoiceData.createdBy.zipCode}
            </p>
            <p>{invoiceData.createdBy.email}</p>
            <p>{invoiceData.createdBy.phoneNo}</p>
          </div>
        </div>

        {/* Items Table */}
        <div className="mt-6">
          <table className="w-full text-sm border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100 text-gray-600">
                <th className="border border-gray-300 p-2 text-left">Item</th>
                <th className="border border-gray-300 p-2 text-left">
                  Description
                </th>
                <th className="border border-gray-300 p-2 text-center">Qty</th>
                <th className="border border-gray-300 p-2 text-right">Price</th>
                <th className="border border-gray-300 p-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-2">App Development</td>
                <td className="border border-gray-300 p-2">
                  Mobile & iOS Application Development
                </td>
                <td className="border border-gray-300 p-2 text-center">2</td>
                <td className="border border-gray-300 p-2 text-right">$460</td>
                <td className="border border-gray-300 p-2 text-right">$920</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">UI/UX Design</td>
                <td className="border border-gray-300 p-2">
                  Mobile & iOS Mobile App Design, Product Design
                </td>
                <td className="border border-gray-300 p-2 text-center">1</td>
                <td className="border border-gray-300 p-2 text-right">$220</td>
                <td className="border border-gray-300 p-2 text-right">$220</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">Web Design</td>
                <td className="border border-gray-300 p-2">
                  Web Design & Development
                </td>
                <td className="border border-gray-300 p-2 text-center">2</td>
                <td className="border border-gray-300 p-2 text-right">$120</td>
                <td className="border border-gray-300 p-2 text-right">$240</td>
              </tr>
            </tbody>
          </table>
          <div className="flex justify-end">
            <div className="w-1/2 bg-gray-100">
              <div className="flex justify-between border py-2">
                <span className="font-semibold">Subtotal:</span>
                <span> ₹{+invoiceData.subTotal?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border py-2">
                <span className="font-semibold">Tax:</span>
                <span>{invoiceData.tax}%</span>
              </div>
            </div>
          </div>
          <div className="flex justify-end font-bold text-gray-800 pt-2">
            <div className="w-1/2 flex justify-between ">
              <span>Total Amount:</span>
              <span> ₹{+invoiceData.total?.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-6 text-sm text-gray-600 py-2">
          <div>
            <span className="font-bold">NOTE:</span>{" "}
            {invoiceData.notes || "No notes"}
          </div>
          <div className=" text-gray-600">
            <p>
              <span className="font-bold">Terms & Conditions: </span>
              {invoiceData.terms || "No Terms & Conditions"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Template7;