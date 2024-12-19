import React, { forwardRef } from "react";

const Template1 = forwardRef((props, ref) => {
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
      className="invoice"
      ref={ref}
      style={{ width: "595px", padding: "20px" }}
    >
      <div className="flex justify-between">
        <div>
          <div className="text-lg font-bold text-start">
            {invoiceData?.createdBy?.name}
          </div>
          <div>Mobile : {invoiceData?.createdBy?.phoneNo}</div>
        </div>
        <div>
          <h3 className="font-bold">TAX INVOICE</h3>
        </div>
      </div>
      <div className="flex justify-between text-start">
        <div className="mt-2 text-start">
          <strong>Bill To :</strong>
          <div>{invoiceData.customerDetails.name}</div>
          <div>Ph : {invoiceData.customerDetails.phone}</div>
        </div>
        <div>
          <div>
            <strong>Invoice # :</strong> {invoiceData.invoiceNo}
          </div>
          <div>
            <strong>Invoice Date :</strong>{" "}
            {DateFormate(invoiceData.invoiceDate)}
          </div>
          <div>
            <strong>Due Date :</strong> {DateFormate(invoiceData.dueDate)}
          </div>
          <div>
            <strong>Place of Supply :</strong> -
          </div>
        </div>
      </div>
      <div className="w-full">
        <table className="w-full mt-5 text-sm">
          <thead>
            <tr className="bg-blue-700 text-white text-center ">
              <th className="border border-black pb-2">Sl. No</th>
              <th className="border border-black pb-2">Product</th>
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
      </div>
      <div className="mt-4 text-end">
        {invoiceData.shippingCharges > 0 && (
          <div>
            Delivery/Shipping Charges :
            <span className="ml-5"> {invoiceData.shippingCharges}</span>
          </div>
        )}
        {invoiceData.packagingCharges > 0 && (
          <div>
            Packaging Charges :
            <span className="ml-5"> {invoiceData.packagingCharges}</span>
          </div>
        )}
      </div>

      <div className="mt-4 mb-3 text-end">
        {invoiceData.tcs.isTcsApplicable && (
          <div>
            TCS :
            <span className="ml-5">
              {invoiceData.tcs.tcs_amount.toFixed(2)}
            </span>
          </div>
        )}
        {invoiceData.tds.isTdsApplicable && (
          <div>
            TDS :
            <span className="ml-5">
              {invoiceData.tds.tds_amount.toFixed(2)}
            </span>
          </div>
        )}
        {invoiceData.totalCgstAmount_9 > 0 && (
          <div>
            CGST 9.0% :
            <span className="ml-5">
              {invoiceData.totalCgstAmount_9.toFixed(2)}
            </span>
          </div>
        )}
        {invoiceData.totalSgstAmount_9 > 0 && (
          <div>
            SGST 9.0% :
            <span className="ml-5">
              {invoiceData.totalSgstAmount_9.toFixed(2)}
            </span>
          </div>
        )}
        {invoiceData.totalCgstAmount_6 > 0 && (
          <div>
            CGST 6.0% :
            <span className="ml-5">
              {invoiceData.totalCgstAmount_6.toFixed(2)}
            </span>
          </div>
        )}
        {invoiceData.totalSgstAmount_6 > 0 && (
          <div>
            SGST 6.0% :
            <span className="ml-5">
              {invoiceData.totalSgstAmount_6.toFixed(2)}
            </span>
          </div>
        )}
        {invoiceData.totalCgstAmount_2_5 > 0 && (
          <div>
            CGST 2.5% :
            <span className="ml-5">
              {invoiceData.totalCgstAmount_2_5.toFixed(2)}
            </span>
          </div>
        )}
        {invoiceData.totalSgstAmount_2_5 > 0 && (
          <div>
            SGST 2.5% :
            <span className="ml-5">
              {invoiceData.totalSgstAmount_2_5.toFixed(2)}
            </span>
          </div>
        )}
      </div>
      <hr />
      <div className="text-end font-bold">
        <h3>Total : {+invoiceData.total?.toFixed(2)}</h3>
      </div>

      <div className=" flex justify-between">
        <div>
          <div>
            <strong>Bank Details</strong>
          </div>
          <div>
            Bank : <span className="font-bold">{bankDetails.bankName}</span>{" "}
          </div>
          <div>
            Account # :{" "}
            <span className="font-bold">{bankDetails.accountNo}</span>
          </div>
          <div>
            IFSC Code :{" "}
            <span className="font-bold">{bankDetails.ifscCode}</span>
          </div>
          <div>
            Branch : <span className="font-bold">{bankDetails.branch}</span>
          </div>
        </div>
        <div className="mt-24">
          <div>Authorized Signatory</div>
        </div>
      </div>
    </div>
  );
});

export default Template1;
