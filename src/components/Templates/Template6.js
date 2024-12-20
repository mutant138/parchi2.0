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

        <div className="grid grid-cols-2 gap-3 text-gray-700">
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
          <div className="text-right"></div>
          <div className="text-right">
            <p className="font-bold">Shipping Address:</p>
            <p>
              {invoiceData.userTo.address}
              {invoiceData.userTo.city}
              {invoiceData.userTo.zipCode}
            </p>
          </div>
          <div className="">
            <p>
              <span className="font-bold">Order Date: </span>
              {DateFormate(invoiceData.dueDate)}
            </p>
          </div>
          <div className=" text-right">
            <p>
              <span className="font-bold">Place of supply: </span>
              {invoiceData.createdBy.city}
            </p>
            <p>
              <span className="font-bold">Place of delivery: </span>
              {invoiceData.userTo.city}
            </p>
            <p>
              <span className="font-bold">InvoiceNumber : </span>
              {invoiceData.no}
            </p>
            <p>
              <span className="font-bold">Invoice Date : </span>
              {DateFormate(invoiceData.invoiceDate)}
            </p>
          </div>
        </div>

        {/* Product Details */}
        <table className="w-full mt-5 text-sm">
          <thead>
            <tr className="bg-gray-300  text-center ">
              <th className="border border-black ">Sl. No</th>
              <th className="border border-black ">Description</th>
              <th className="border border-black ">Unit Price</th>
              <th className="border border-black ">Discount</th>
              <th className="border border-black ">Qty</th>
              <th className="border border-black ">Net Amount</th>
              <th className="border border-black ">Tax Rate</th>
              <th className="border border-black ">Tax Type</th>
              <th className="border border-black ">Tax Amount</th>
              <th className="border border-black ">Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoiceData.products.map((item, index) => (
              <tr key={index}>
                <td className="border border-black  pl-1">{index + 1}</td>
                <td className="border border-black  pl-1">
                  {item.name}
                  {item.description && " | " + item.description}
                </td>
                <td className="border border-black  pl-1">
                  {item.sellingPrice.toFixed(1)}
                </td>
                <td className="border border-black  pl-1">
                  {item.discount.toFixed(1)}
                </td>
                <td className="border border-black  pl-1">{item.quantity}</td>
                <td className="border border-black  pl-1">
                  {item.sellingPrice.toFixed(1)}
                </td>
                <td className="border border-black  pl-1">{item.tax}%</td>
                <td className="border border-black  pl-1">CGST SGST</td>
                <td className="border border-black  pl-1">
                  {item.taxAmount.toFixed(2)}
                </td>
                <td className="border border-black  pl-1">
                  {item.totalAmount.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between border-x border-black border-b">
          <div className="font-bold">Total:</div>
          <div className="text-right">₹{+invoiceData.total?.toFixed(2)}</div>
        </div>
        <div className="text-end border-x font-bold border-black border-b">
          <div className="">For {invoiceData.createdBy.name}:</div>
          <div className="">Authorized Signatory</div>
        </div>

        {/* Footer */}
        <div className="w-full text-sm">
          <div>
            <span className="font-bold">NOTE:</span>{" "}
            {invoiceData.notes || "No notes"}
          </div>
          <div className="">
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

export default Template6;
