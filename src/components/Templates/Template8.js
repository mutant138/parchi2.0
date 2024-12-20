import React, { forwardRef } from "react";

const Template8 = forwardRef((props, ref) => {
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
        <div className="border border-black ">
          {/* Header */}
          <div className="flex justify-center items-center border-b border-black px-2 pb-4">
            <h1 className="text-3xl flex justify-start  w-30 font-bold text-green-500">
              {invoiceData?.createdBy?.name}
            </h1>
            <div className="text-center w-full">
              <p className="text-gray-800">
                <p className="font-bold uppercase">
                  {invoiceData?.createdBy?.name}
                </p>
                <p>{invoiceData.createdBy.address}</p>
                <p>{invoiceData.createdBy.city}</p>
                <p>{invoiceData.createdBy.zipCode}</p>
                <p>Mobile: {invoiceData.createdBy.phoneNo}</p>
              </p>
            </div>
          </div>
          {/* Invoice Details */}
          <div className="grid grid-cols-2 px-2 gap-4 border-b border-black">
            <div className="border-r border-black">
              <h3 className="font-bold text-gray-800">User Details:</h3>
              <p>{invoiceData.userTo.name} </p>
              <p>{invoiceData.userTo.address} </p>
              <p>{invoiceData.userTo.city} </p>
              <p>{invoiceData.userTo.zipCode} </p>
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Invoice Details:</h3>
              <div className="grid grid-cols-2">
                <div>Invoice #:</div>
                <div> {invoiceData.no}</div>
                <div>Invoice Date:</div>
                <div> {DateFormate(invoiceData.invoiceDate)}</div>
                <div>Due Date:</div>
                <div>{DateFormate(invoiceData.dueDate)}</div>
                <div>Place of Supply:</div>
                <div> {invoiceData.userTo.city}</div>
              </div>
            </div>
          </div>
          {/* Items Table */}
          <div className="">
            <table className="w-full border-collapse border-b border-black text-gray-800">
              <thead>
                <tr className="">
                  <th className="border-b border-r border-black pl-1 text-left">
                    #
                  </th>
                  <th className="border-b border-r border-black pl-1 text-left">
                    Item
                  </th>
                  <th className="border-b border-r border-black pl-1 text-left">
                    Unit Price
                  </th>
                  <th className="border-b border-r border-black pl-1 text-right">
                    Tax
                  </th>
                  <th className="border-b border-r border-black pl-1 text-center">
                    Discount
                  </th>
                  <th className="border-b border-r border-black pl-1 text-center">
                    Qty
                  </th>
                  <th className="border-b border-r border-black pl-1 text-right">
                    Rate
                  </th>
                  <th className="border-b  border-black pl-1 text-right">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoiceData.products.map((item, index) => (
                  <tr key={index}>
                    <td className="text-left border-r border-black  pl-1">
                      {index + 1}
                    </td>
                    <td className="text-left border-r border-black  pl-1">
                      {item.name}
                    </td>
                    <td className="text-left border-r border-black  pl-1">
                      {item.sellingPrice.toFixed(1)}
                    </td>
                    <td className="text-right border-r border-black  pl-1">
                      {item.tax}%
                    </td>
                    <td className="text-center border-r border-black  pl-1">
                      {item.discount.toFixed(1)}
                    </td>
                    <td className="text-center border-r border-black  pl-1">
                      {item.quantity}
                    </td>
                    <td className="text-right border-r border-black  pl-1">
                      {item.sellingPrice.toFixed(1)}
                    </td>

                    <td className="text-right pl-1">
                      {item.totalAmount.toFixed(2)}
                    </td>
                  </tr>
                ))}
                <tr className="">
                  <td className="text-left border-r border-black  pl-1"></td>
                  <td className="text-end border-r border-black  pl-1">
                    <p>SGST 2.5%</p>
                    <p>CGST 2.5%</p>
                    <p>SGST 6.0%</p>
                    <p>CGST 6.0%</p>
                    <p>SGST 9.0%</p>
                    <p>CGST 9.0%</p>
                    <p>TDS</p>
                    <p>TCS</p>
                    <p>Delivery/Shipping</p>
                    <p>Packaging</p>
                  </td>
                  <td className="text-left border-r border-black  pl-1"></td>
                  <td className="text-right border-r border-black  pl-1"></td>
                  <td className="text-center border-r border-black  pl-1"></td>
                  <td className="text-center border-r border-black  pl-1"></td>
                  <td className="text-right border-r border-black  pl-1"></td>
                  <td className="text-right   pl-1">
                    <p>{invoiceData.totalSgstAmount_2_5.toFixed(2)}%</p>
                    <p>{invoiceData.totalCgstAmount_2_5.toFixed(2)}%</p>
                    <p>{invoiceData.totalSgstAmount_6.toFixed(2)}%</p>
                    <p>{invoiceData.totalCgstAmount_6.toFixed(2)}%</p>
                    <p>{invoiceData.totalSgstAmount_9.toFixed(2)}%</p>
                    <p>{invoiceData.totalCgstAmount_9.toFixed(2)}%</p>
                    <p>{invoiceData.tds.tds_amount.toFixed(2)}%</p>
                    <p>{invoiceData.tcs.tcs_amount.toFixed(2)}%</p>
                    <p>{invoiceData.shippingCharges}</p>
                    <p>{invoiceData.packagingCharges}</p>
                  </td>
                </tr>
                <tr className="border-t-2 border-black">
                  <td className="text-left border-r border-black  pl-1"></td>
                  <td className="text-end border-r border-black  pl-1">
                    Total
                  </td>
                  <td className="text-left border-r border-black  pl-1"></td>
                  <td className="text-right border-r border-black  pl-1"></td>
                  <td className="text-center border-r border-black  pl-1"></td>
                  <td className="text-center border-r border-black  pl-1"></td>
                  <td className="text-right border-r border-black  pl-1"></td>
                  <td className="text-right   pl-1">
                    ₹{+invoiceData.total?.toFixed(2)}
                  </td>
                </tr>
                {/* Repeat rows for more items */}
              </tbody>
            </table>
          </div>

          {/* Footer Section */}
          <div className="flex justify-between">
            <div className="w-full border-r-2 border-black px-2">
              <h3 className="font-bold text-gray-800">Bank Details:</h3>
              <p>Bank: {bankDetails.bankName}</p>
              <p>Account #: {bankDetails.accountNo}</p>
              <p>IFSC: {bankDetails.ifscCode}</p>
              <p>Branch: {bankDetails.branch}</p>
            </div>
            <div className="text-sm text-gray-600 w-3/4 px-2">
              <div className="font-bold text-gray-800">Note:</div>
              <div className="">{invoiceData.notes || "No Notes"}</div>
              <div className="font-bold text-gray-800">
                Terms and Conditions:
              </div>
              <p>{invoiceData.terms || "No Terms & Conditions"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Template8;
