import React, { forwardRef } from "react";

const Template8 = forwardRef((props, ref) => {
  return (
    <div className="max-w-5xl mx-auto p-6 bg-white border border-gray-300 shadow-md text-sm">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <img src="/bigbazaar-logo.png" alt="Big Bazaar" className="h-16" />
          <p className="text-gray-800">
            GSTIN: 27ABCCC7277Q1ZX <br />
            64, Whitefield Main Rd, Palm Meadows <br />
            Karnataka, 560066 <br />
            Mobile: 9999999999
          </p>
        </div>
        <div className="text-right">
          <h1 className="text-xl font-bold">TAX INVOICE</h1>
          <p>Original for Recipient</p>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <h3 className="font-bold text-gray-800">Customer Details:</h3>
          <p>Kishore Biriyani</p>
          <p>Ph: 9999999999</p>
          <p>64, Whitefield Main Rd</p>
          <p>Bengaluru, Karnataka, 560066</p>
        </div>
        <div>
          <h3 className="font-bold text-gray-800">Invoice Details:</h3>
          <p>Invoice #: INV-1</p>
          <p>Invoice Date: 17 Jun 2023</p>
          <p>Due Date: 17 Jun 2023</p>
          <p>Place of Supply: 29-Karnataka</p>
        </div>
      </div>

      {/* Items Table */}
      <div className="mt-6">
        <table className="w-full border-collapse border border-gray-300 text-gray-800">
          <thead>
            <tr className="bg-gray-100 text-gray-600">
              <th className="border border-gray-300 p-2 text-left">#</th>
              <th className="border border-gray-300 p-2 text-left">Item</th>
              <th className="border border-gray-300 p-2 text-left">HSN/SAC</th>
              <th className="border border-gray-300 p-2 text-right">Tax</th>
              <th className="border border-gray-300 p-2 text-center">Qty</th>
              <th className="border border-gray-300 p-2 text-right">Rate</th>
              <th className="border border-gray-300 p-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 p-2">1</td>
              <td className="border border-gray-300 p-2">
                Colgate 200 gm fresh gel
              </td>
              <td className="border border-gray-300 p-2">33061020</td>
              <td className="border border-gray-300 p-2 text-right">18%</td>
              <td className="border border-gray-300 p-2 text-center">2 NOS</td>
              <td className="border border-gray-300 p-2 text-right">33.90</td>
              <td className="border border-gray-300 p-2 text-right">67.80</td>
            </tr>
            {/* Repeat rows for more items */}
          </tbody>
        </table>
      </div>

      {/* Tax Details */}
      <div className="mt-6">
        <h3 className="font-bold text-gray-800">Tax Summary</h3>
        <table className="w-full border-collapse border border-gray-300 text-gray-800 mt-2">
          <thead>
            <tr className="bg-gray-100 text-gray-600">
              <th className="border border-gray-300 p-2 text-left">HSN/SAC</th>
              <th className="border border-gray-300 p-2 text-right">
                Taxable Value
              </th>
              <th className="border border-gray-300 p-2 text-right">
                Central Tax
              </th>
              <th className="border border-gray-300 p-2 text-right">
                State Tax
              </th>
              <th className="border border-gray-300 p-2 text-right">
                Total Tax Amount
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 p-2">33061020</td>
              <td className="border border-gray-300 p-2 text-right">67.80</td>
              <td className="border border-gray-300 p-2 text-right">6.10</td>
              <td className="border border-gray-300 p-2 text-right">6.10</td>
              <td className="border border-gray-300 p-2 text-right">12.20</td>
            </tr>
            {/* Repeat rows for more HSN codes */}
          </tbody>
        </table>
      </div>

      {/* Footer Section */}
      <div className="mt-6 flex justify-between">
        {/* Bank Details */}
        <div>
          <h3 className="font-bold text-gray-800">Bank Details:</h3>
          <p>Bank: YES BANK</p>
          <p>Account #: 67889909222445</p>
          <p>IFSC: YESB0BL4567</p>
          <p>Branch: Kodihalli</p>
        </div>

        {/* QR Code */}
        <div className="text-center">
          <h3 className="font-bold text-gray-800">Pay using UPI</h3>
          <img src="/qr-code.png" alt="QR Code" className="h-24 w-24 mx-auto" />
        </div>
      </div>

      {/* Terms & Conditions */}
      <div className="mt-6 text-sm text-gray-600">
        <h3 className="font-bold text-gray-800">Terms and Conditions:</h3>
        <p>1. Goods once sold cannot be taken back or exchanged.</p>
        <p>2. We are not the manufacturers; warranty as per terms.</p>
        <p>3. Interest @24% p.a. on unpaid bills beyond 15 days.</p>
        <p>4. Subject to local jurisdiction.</p>
      </div>
    </div>
  );
});

export default Template8;
