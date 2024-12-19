import React, { forwardRef } from "react";
import SunyaLogo from "../../assets/SunyaLogo.jpg";

const Template4 = forwardRef((props, ref) => {
  return (
    <div className="bg-gray-50 p-10 font-sans">
      <div className="border border-gray-300 p-8 bg-white max-w-3xl mx-auto shadow-md">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">H.R. ENTERPRISE</h1>
          <p className="text-sm">
            12, VRUNDAVAN NAGAR, ODHAV RIND ROAD, B/H GAURI CINEMA, ODHAV,
            AHMEDABAD-382415, INDIA.
          </p>
        </div>

        {/* Invoice Details */}
        <div className="flex justify-between mb-4">
          <div>
            <p>
              <strong>M/s.:</strong> Smith Rhodes
            </p>
            <p>15 Hodges Mews,</p>
            <p>High Wycombe</p>
            <p>HP12 3JL</p>
            <p>Thailand</p>
          </div>
          <div>
            <p>
              <strong>Invoice No:</strong> 56
            </p>
            <p>
              <strong>Date:</strong> 03/10/2023
            </p>
          </div>
        </div>

        {/* Product Table */}
        <table className="w-full border-collapse border border-gray-400 text-sm">
          <thead>
            <tr>
              <th className="border border-gray-400 px-2 py-1">SrNo</th>
              <th className="border border-gray-400 px-2 py-1">Product Name</th>
              <th className="border border-gray-400 px-2 py-1">Qty</th>
              <th className="border border-gray-400 px-2 py-1">Rate</th>
              <th className="border border-gray-400 px-2 py-1">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-400 px-2 py-1 text-center">
                1
              </td>
              <td className="border border-gray-400 px-2 py-1">
                STYLE KERATIN SH. 250ML
              </td>
              <td className="border border-gray-400 px-2 py-1 text-center">
                3
              </td>
              <td className="border border-gray-400 px-2 py-1 text-right">
                $25.75
              </td>
              <td className="border border-gray-400 px-2 py-1 text-right">
                $77.25
              </td>
            </tr>
            <tr>
              <td className="border border-gray-400 px-2 py-1 text-center">
                2
              </td>
              <td className="border border-gray-400 px-2 py-1">
                SEASOUL GOLD MOROCCAN ANTI AGEING KIT
              </td>
              <td className="border border-gray-400 px-2 py-1 text-center">
                1
              </td>
              <td className="border border-gray-400 px-2 py-1 text-right">
                $40.12
              </td>
              <td className="border border-gray-400 px-2 py-1 text-right">
                $40.12
              </td>
            </tr>
            <tr>
              <td className="border border-gray-400 px-2 py-1 text-center">
                3
              </td>
              <td className="border border-gray-400 px-2 py-1">
                KERASOUL ONION SH-200ML
              </td>
              <td className="border border-gray-400 px-2 py-1 text-center">
                6
              </td>
              <td className="border border-gray-400 px-2 py-1 text-right">
                $12.00
              </td>
              <td className="border border-gray-400 px-2 py-1 text-right">
                $72.00
              </td>
            </tr>
            <tr>
              <td className="border border-gray-400 px-2 py-1 text-center">
                4
              </td>
              <td className="border border-gray-400 px-2 py-1">
                KERASOUL ONION MASK-200GM
              </td>
              <td className="border border-gray-400 px-2 py-1 text-center">
                4
              </td>
              <td className="border border-gray-400 px-2 py-1 text-right">
                $13.50
              </td>
              <td className="border border-gray-400 px-2 py-1 text-right">
                $54.00
              </td>
            </tr>
          </tbody>
        </table>

        {/* Totals */}
        <div className="mt-4 text-sm">
          <p>
            <strong>GSTIN No.:</strong> 26AKJPG9221EIW5
          </p>
          <div className="flex justify-between border-t border-gray-400 pt-2">
            <p>Sub Total:</p>
            <p>$243.37</p>
          </div>
          <div className="flex justify-between">
            <p>Central Tax (9.00%):</p>
            <p>$21.09</p>
          </div>
          <div className="flex justify-between">
            <p>State Tax (9.00%):</p>
            <p>$21.09</p>
          </div>
          <div className="flex justify-between font-bold border-t border-gray-400 pt-2">
            <p>Grand Total:</p>
            <p>$285.55</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-sm">
          <p>
            <strong>Bill Amount:</strong> Thirty Thousand Forty Four Only
          </p>
          <p className="mt-4">
            <strong>Terms & Condition:</strong>
          </p>
          <ul className="list-disc list-inside">
            <li>Goods once sold will not be taken back.</li>
            <li>Our risk and responsibility ceases as soon.</li>
          </ul>
          <div className="text-right mt-6">
            <p>For, H.R. ENTERPRISE</p>
            <p className="mt-8">(Authorised Signatory)</p>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Template4;
