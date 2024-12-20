import React, { forwardRef } from "react";

const Template6 = forwardRef((props, ref) => {
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

    return `${getDate}/${getMonth}/${getFullYear}`;
  }
  return (
    <div
      className=" bg-white border border-gray-300 rounded-md shadow-md overflow-y-auto"
      style={{ height: "80vh" }}
    >
      <div ref={ref} style={{ width: "595px", padding: "20px" }}>
        {/* Header */}
        <div className="flex justify-between items-center pb-4 mb-3">
          <h1 className="text-3xl font-bold ">
            {invoiceData?.createdBy?.name}
          </h1>
          <div className="text-end">
            <div className=" font-bold text-gray-800">
              Tax Invoice/Bill of Supply/Cash Memo
            </div>
            <div>(Original for Recipient) </div>
          </div>
        </div>

        {/* Sold By and Billing Details */}
        <div className="grid grid-cols-2 gap-6 text-gray-700">
          <div>
            <h3 className="font-bold">Sold By:</h3>
            <p> {invoiceData?.createdBy?.name}</p>
            <p> {invoiceData.createdBy.address}</p>
            <p> {invoiceData.createdBy.city}</p>
            <p> {invoiceData.createdBy.zipCode}</p>
          </div>
          <div className="text-right">
            <h3 className="font-bold">Billing Address:</h3>
            <p>{invoiceData.userTo.name} </p>
            <p>{invoiceData.userTo.address} </p>
            <p>{invoiceData.userTo.city} </p>
            <p>{invoiceData.userTo.zipCode} </p>
          </div>
          <div className="text-right">
            <p className="font-bold">Shipping Address:</p>
            <p>
              {invoiceData.userTo.address}
              {invoiceData.userTo.city}
              {invoiceData.userTo.zipCode}
            </p>
          </div>
          {/* Order Details */}
          <div className="mt-6">
            {/* <p>Order Number: {invoiceData.no}</p> */}
            <p>Order Date:{DateFormate(invoiceData.dueDate)}</p>
          </div>
        </div>

        {/* Product Details */}
        <table className="w-full mt-5 text-sm">
          <thead>
            <tr className="bg-gray-300  text-center ">
              <th className="border border-black pb-2">Sl. No</th>
              <th className="border border-black pb-2">Description</th>
              <th className="border border-black pb-2">Unit Price</th>
              <th className="border border-black pb-2">Discount</th>
              <th className="border border-black pb-2">Qty</th>
              <th className="border border-black pb-2">Net Amount</th>
              <th className="border border-black pb-2">Tax Rate</th>
              <th className="border border-black pb-2">Tax Type</th>
              <th className="border border-black pb-2">Tax Amount</th>
              <th className="border border-black pb-2">Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoiceData.products.map((item, index) => (
              <tr key={index}>
                <td className="border border-black pt-2 pb-2 pl-1">
                  {index + 1}
                </td>
                <td className="border border-black pt-2 pb-2 pl-1">
                  {item.name}
                  {item.description && " | " + item.description}
                </td>
                <td className="border border-black pt-2 pb-2 pl-1">
                  {item.sellingPrice.toFixed(1)}
                </td>
                <td className="border border-black pt-2 pb-2 pl-1">
                  {item.discount.toFixed(1)}
                </td>
                <td className="border border-black pt-2 pb-2 pl-1">
                  {item.quantity}
                </td>
                <td className="border border-black pt-2 pb-2 pl-1">
                  {item.sellingPrice.toFixed(1)}
                </td>
                <td className="border border-black pt-2 pb-2 pl-1">
                  {item.tax}%
                </td>
                <td className="border border-black pt-2 pb-2 pl-1">
                  CGST SGST
                </td>
                <td className="border border-black pt-2 pb-2 pl-1">
                  {item.taxAmount.toFixed(2)}
                </td>
                <td className="border border-black pt-2 pb-2 pl-1">
                  {item.totalAmount.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Total */}
        <div className="mt-6 flex justify-end">
          <div className="text-right">
            <h3 className="text-lg font-bold">Total Amount: ₹74,900.00</h3>
            <p className="text-sm text-gray-700">
              Amount in Words: Seventy-four Thousand Nine Hundred only
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-sm text-gray-700">
          <p>Whether tax is payable under reverse charge: No</p>
        </div>
      </div>
    </div>
  );
});

export default Template6;
