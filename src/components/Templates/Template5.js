import React, { forwardRef } from "react";

const Template5 = forwardRef((props, ref) => {
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
        <div className="flex justify-between items-center ">
          <div className="flex items-center space-x-2">
            <h1 className="text-3xl font-bold text-green-500">
              {invoiceData?.createdBy?.name}
            </h1>
            <div>
              <div className=" font-bold ">
                {invoiceData?.createdBy?.name} Invoice
              </div>
              {/* <p><span></span>GSTIN: 4828E9B55BD92X6</p>
            <p>State: Ontario, Toronto</p>
            <p>PAN: BSDF4O7ERPCRM</p> */}
            </div>
          </div>
          <div className="text-right">
            <p>
              <span className="font-bold">Total:</span> ₹
              {+invoiceData.total?.toFixed(2)}
            </p>
            <p>
              <span className="font-bold">Invoice Date:</span>
              {DateFormate(invoiceData.dueDate)}
            </p>
            <p>
              <span className="font-bold">Invoice No:</span> {invoiceData.no}
            </p>
          </div>
        </div>
        <div className="flex justify-between items-center my-3">
          <div className="border w-full"></div>
          <div className="text-green-500 w-full text-center">TAX INVOICE</div>
          <div className="border w-full"></div>
        </div>
        {/* Tax Invoice Details */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div>
            <p className="font-bold">User Name:</p>
            <p>{invoiceData?.userTo?.name}</p>
            {/* <p>Customer GSTIN: 4828E9B55BD92X6</p> */}
          </div>
          <div>
            <p className="font-bold">Billing Address:</p>
            <p>
              {" "}
              {invoiceData.createdBy.address}
              {invoiceData.createdBy.city}
              {invoiceData.createdBy.zipCode}
            </p>
          </div>
          <div>
            <p className="font-bold">Shipping Address:</p>
            <p>
              {" "}
              {invoiceData.userTo.address}
              {invoiceData.userTo.city}
              {invoiceData.userTo.zipCode}
            </p>
          </div>
        </div>

        <div className="flex justify-between mb-6 border-dotted border-black border-y-2 p-2">
          <div>
            <p>
              <span className="font-bold">County of Supply: </span>India
            </p>
          </div>
          <div>
            <p>
              <span className="font-bold">Place of Supply: </span>
              {invoiceData.userTo.city}
            </p>
          </div>
          <div>
            <p>
              <span className="font-bold">Due Date:</span>{" "}
              {DateFormate(invoiceData.dueDate)}
            </p>
          </div>
        </div>

        {/* Invoice Table */}
        <table className="w-full mt-5 border">
          <thead>
            <tr className="bg-gray-200  text-start ">
              <th className=" text-start pl-1 pb-2">Item</th>
              <th className=" text-start pl-1 pb-2">Rate</th>
              <th className=" text-start pl-1 pb-2">Discount</th>
              <th className=" text-start pl-1 pb-2">Unit Price</th>
              <th className=" text-start pl-1 pb-2">Qty</th>
              <th className=" text-start pl-1 pb-2">Tax Type</th>
              <th className=" text-start pl-1 pb-2">Tax Amount</th>
              <th className=" text-start pl-1 pb-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {invoiceData.products.map((item, index) => (
              <tr key={index} className="border-t-2">
                <td className=" pt-2 pb-2 pl-1">{item.name}</td>
                <td className=" pt-2 pb-2 pl-1">{item.tax}%</td>
                <td className=" pt-2 pb-2 pl-1">{item.discount.toFixed(1)}</td>
                <td className=" pt-2 pb-2 pl-1">
                  {item.sellingPrice.toFixed(1)}
                </td>
                <td className=" pt-2 pb-2 pl-1">{item.quantity}</td>
                <td className=" pt-2 pb-2 pl-1">CGST SGST</td>
                <td className=" pt-2 pb-2 pl-1">{item.taxAmount.toFixed(2)}</td>
                <td className=" pt-2 pb-2 pl-1">
                  {item.totalAmount.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Footer */}
        <div className="flex justify-between my-3">
          <div className="w-full">
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
          <div className="w-1/2">
            <div className="grid grid-cols-2 text-end">
              <div>Sub Total:</div>
              <div>₹{+invoiceData.subTotal?.toFixed(2)}</div>
              <div>Discount:</div>{" "}
              <div>
                {!invoiceData.extraDiscountType && "₹"}
                {invoiceData.extraDiscount}
                {invoiceData.extraDiscountType && "%"}
              </div>
              <div>Tax:</div>
              <div className=" border-b-2  border-black border-dotted">
                {" "}
                {invoiceData.tax}%
              </div>
            </div>
            <div className="font-bold grid grid-cols-2 text-end pt-3">
              <div>Total:</div>
              <div>₹{+invoiceData.total?.toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Template5;
