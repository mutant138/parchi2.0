import React from "react";
import SunyaLogo from "../../assets/SunyaLogo.jpg";

const Template3 = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md">
      {/* Header */}
      <header className="flex justify-between items-center border-b pb-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-blue-500">KOICE</h1>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-bold">Invoice</h2>
          <p>Invoice No: 16835</p>
        </div>
      </header>

      {/* Invoice Details */}
      <section className="flex justify-between text-sm mb-6">
        <div>
          <h3 className="font-bold">Invoiced To:</h3>
          <p>Smith Rhodes</p>
          <p>15 Hodges Mews, High Wycombe</p>
          <p>HP12 3JL, United Kingdom</p>
        </div>
        <div className="text-right">
          <h3 className="font-bold">Pay To:</h3>
          <p>Koice Inc</p>
          <p>2705 N. Enterprise St</p>
          <p>Orange, CA 92865</p>
          <p>contact@koiceinc.com</p>
        </div>
      </section>

      {/* Table */}
      <table className="w-full text-sm border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2 text-left">
              Service
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Description
            </th>
            <th className="border border-gray-300 px-4 py-2 text-right">
              Rate
            </th>
            <th className="border border-gray-300 px-4 py-2 text-right">QTY</th>
            <th className="border border-gray-300 px-4 py-2 text-right">
              Amount
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-300 px-4 py-2">Design</td>
            <td className="border border-gray-300 px-4 py-2">
              Creating a website design
            </td>
            <td className="border border-gray-300 px-4 py-2 text-right">
              $50.00
            </td>
            <td className="border border-gray-300 px-4 py-2 text-right">10</td>
            <td className="border border-gray-300 px-4 py-2 text-right">
              $500.00
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2">Development</td>
            <td className="border border-gray-300 px-4 py-2">
              Website Development
            </td>
            <td className="border border-gray-300 px-4 py-2 text-right">
              $120.00
            </td>
            <td className="border border-gray-300 px-4 py-2 text-right">10</td>
            <td className="border border-gray-300 px-4 py-2 text-right">
              $1200.00
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2">SEO</td>
            <td className="border border-gray-300 px-4 py-2">
              Optimize the site for search engines (SEO)
            </td>
            <td className="border border-gray-300 px-4 py-2 text-right">
              $450.00
            </td>
            <td className="border border-gray-300 px-4 py-2 text-right">1</td>
            <td className="border border-gray-300 px-4 py-2 text-right">
              $450.00
            </td>
          </tr>
        </tbody>
      </table>

      {/* Summary */}
      <section className="text-right mt-6 text-sm">
        <p>
          Sub Total: <span className="font-bold">$2150.00</span>
        </p>
        <p>
          Tax: <span className="font-bold">$215.00</span>
        </p>
        <p>
          Total: <span className="font-bold text-lg">$2365.00</span>
        </p>
      </section>

      {/* Note */}
      <footer className="mt-6 text-center text-gray-500 text-xs">
        <p>
          NOTE: This is a computer-generated receipt and does not require a
          physical signature.
        </p>
      </footer>
    </div>
  );
};

export default Template3;
