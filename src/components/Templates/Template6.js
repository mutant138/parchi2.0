import React, { forwardRef } from "react";

const Template6 = forwardRef((props, ref) => {
  return (
    <div className="max-w-4xl mx-auto p-8 border border-gray-300 shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-4 mb-6">
        <img src="/amazon-logo.png" alt="Amazon" className="w-32" />
        <h2 className="text-xl font-bold text-gray-800">
          Tax Invoice/Bill of Supply/Cash Memo
        </h2>
      </div>

      {/* Sold By and Billing Details */}
      <div className="grid grid-cols-2 gap-6 text-sm text-gray-700">
        <div>
          <h3 className="font-bold">Sold By:</h3>
          <p>Appario Retail Private Ltd</p>
          <p>Building No. CCU1, Mouza, Amraberia, Phase 2</p>
          <p>Howrah, West Bengal, 711303</p>
          <p>PAN No: AALCA0171E</p>
          <p>GST Registration No: 19AALCA0171E1ZW</p>
        </div>
        <div>
          <h3 className="font-bold">Billing Address:</h3>
          <p>Souvik Haldar</p>
          <p>Debigarh 2nd Lane</p>
          <p>Madhyamgram, West Bengal, 700129</p>
          <p>State/UT Code: 19</p>
        </div>
      </div>

      {/* Order Details */}
      <div className="mt-6">
        <h3 className="font-bold text-sm">Order Details:</h3>
        <p>Order Number: 402-5005041-4753952</p>
        <p>Order Date: 04.02.2022</p>
      </div>

      {/* Product Details */}
      <table className="w-full mt-6 text-sm border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 p-2">Sl. No</th>
            <th className="border border-gray-300 p-2">Description</th>
            <th className="border border-gray-300 p-2">Unit Price</th>
            <th className="border border-gray-300 p-2">Qty</th>
            <th className="border border-gray-300 p-2">Net Amount</th>
            <th className="border border-gray-300 p-2">Tax Type</th>
            <th className="border border-gray-300 p-2">Tax Amount</th>
            <th className="border border-gray-300 p-2">Total Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-300 p-2 text-center">1</td>
            <td className="border border-gray-300 p-2">
              Apple iPhone 13 (128GB) - (Product) RED
            </td>
            <td className="border border-gray-300 p-2 text-right">
              ₹63,474.58
            </td>
            <td className="border border-gray-300 p-2 text-center">1</td>
            <td className="border border-gray-300 p-2 text-right">
              ₹63,474.58
            </td>
            <td className="border border-gray-300 p-2 text-center">
              CGST, SGST
            </td>
            <td className="border border-gray-300 p-2 text-right">
              ₹11,425.42
            </td>
            <td className="border border-gray-300 p-2 text-right">
              ₹74,900.00
            </td>
          </tr>
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
  );
});

export default Template6;
