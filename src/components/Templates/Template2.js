import React, { forwardRef } from "react";

const Template2 = forwardRef((props, ref) => {
  const { invoiceData, bankDetails } = props;
  console.log("🚀 ~ Template1 ~ invoiceData:", invoiceData);
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
        <div className="flex justify-between items-center border-b pb-4 mb-6">
          <div className="">
            <span className="text-3xl font-bold text-primary-600">
              {invoiceData?.createdBy?.name}
            </span>
          </div>
          <div className="text-right">
            <h1 className="text-xl font-bold"># Invoice</h1>
            <p>
              Invoice:{" "}
              <span className="font-medium">{invoiceData.invoiceNo}</span>
            </p>
            <p>
              Date:{" "}
              <span className="font-medium">
                {DateFormate(invoiceData.dueDate)}
              </span>
            </p>
            <p>
              Status:{" "}
              <span className="font-medium">{invoiceData.paymentStatus}</span>
            </p>
          </div>
        </div>

        {/* Seller and Buyer Info */}
        <div className="grid grid-cols-2 border-2">
          <div>
            <h2 className="font-semibold bg-gray-800 text-white p-1 px-3">
              Seller
            </h2>
            <div className="p-4">
              <p> {invoiceData?.createdBy?.name}</p>
              <p>{invoiceData.createdBy.email}</p>
              <p>{invoiceData.createdBy.phoneNo}</p>
            </div>
          </div>
          <div>
            <h2 className="font-semibold bg-gray-800 text-white p-1 px-3">
              Buyer
            </h2>
            <div className="p-4">
              <p>{invoiceData?.customerDetails?.name}</p>
              <p>
                {invoiceData.customerDetails.address}
                {invoiceData.customerDetails.city}
                {invoiceData.customerDetails.zipCode}
              </p>
              <p>{invoiceData.customerDetails.phone}</p>
              <p>{invoiceData.customerDetails.email}</p>
            </div>
          </div>
        </div>

        {/* Product Table */}
        <table className="w-full border border-collapse mb-6">
          <thead>
            <tr className="bg-gray-800 border text-white">
              <th className="border ">#</th>
              <th className="border ">Product</th>
              <th className="border ">Quantity</th>
              <th className="border ">MRP</th>
              <th className="border ">Unit Price</th>
              <th className="border ">Total</th>
            </tr>
          </thead>
          <tbody>
            {invoiceData.products.map((item, index) => (
              <tr key={index}>
                <td className="border  py-2 pl-1">{index + 1}</td>
                <td className="border  py-2 pl-1">{item.name}</td>
                <td className="border  py-2 pl-1">{item.quantity}</td>
                <td className="border  py-2 pl-1">
                  {item.sellingPrice.toFixed(1)}
                </td>
                <td className="border   py-2 pl-1">
                  {item.netAmount.toFixed(2)}
                </td>
                <td className="border   py-2 pl-1">
                  {item.totalAmount.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Payment Status */}
        <div className="border w-full flex justify-between mb-6">
          <div className="p-4">
            <h3 className="font-semibold">
              Payment Status: {invoiceData.paymentStatus}
            </h3>
            {/* <p>Paid Amount: $317</p>
          <p>Due Amount: $256.97</p> */}
            <p>Payment Mode: {invoiceData.mode}</p>
          </div>

          {/* Total and Summary */}
          <div className="">
            <table className="">
              <tr>
                <td className="border px-2 py-1"> Subtotal</td>
                <td className="border px-2 py-1">₹{invoiceData.subTotal}</td>
              </tr>
              <tr>
                <td className="border px-2 py-1"> Tax </td>
                <td className="border px-2 py-1">{invoiceData.tax}%</td>
              </tr>
              <tr>
                <td className="border px-2 py-1"> Discount </td>
                <td className="border px-2 py-1">
                  {!invoiceData.extraDiscountType && "₹"}
                  {invoiceData.extraDiscount}
                  {invoiceData.extraDiscountType && "%"}
                </td>
              </tr>

              {invoiceData.packagingCharges > 0 && (
                <tr>
                  <td className="border px-2 py-1">Packaging </td>
                  <td className="border px-2 py-1">
                    {" "}
                    ₹{invoiceData.packagingCharges}
                  </td>
                </tr>
              )}
              {invoiceData.shippingCharges > 0 && (
                <tr>
                  <td className="border px-2 py-1"> Shipping </td>
                  <td className="border px-2 py-1">
                    {" "}
                    ₹{invoiceData.shippingCharges}
                  </td>
                </tr>
              )}
              <tr className="font-semibold border">
                <td className="border px-2 py-1">Total </td>
                <td className="border px-2 py-1">
                  ₹{+invoiceData.total?.toFixed(2)}
                </td>
              </tr>
            </table>
          </div>
        </div>
        <div className="flex justify-between pb-4">
          <div className="">
            <div className="">Note:</div>
            <div className="">{invoiceData.notes || "No Notes"}</div>
          </div>
          <div className="">Authorized Person</div>
        </div>

        {/* Footer */}
        <div className="border-t pt-4 text-sm text-gray-600">
          <p>Terms & Conditions</p>
          <p>{invoiceData.terms || "No Terms & Conditions"}</p>
        </div>
      </div>
    </div>
  );
});

export default Template2;
