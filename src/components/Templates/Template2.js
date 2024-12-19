import React from "react";
import SunyaLogo from "../../assets/SunyaLogo.jpg";

const Template2 = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto bg-white border border-gray-300 rounded-md shadow-md">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-4 mb-6">
        <div className="">
          <img src={SunyaLogo} width={100} alt="logo" height={100} />
          <span className="text-3xl font-bold text-primary-600">Sunya</span>
        </div>
        <div className="text-right">
          <h1 className="text-xl font-bold"># Invoice</h1>
          <p>
            Invoice: <span className="font-medium">PUR-35</span>
          </p>
          <p>
            Date: <span className="font-medium">08-12-2024</span>
          </p>
          <p>
            Status: <span className="font-medium">Received</span>
          </p>
          <p>
            Sold By: <span className="font-medium">Prof. Noemie Ortiz</span>
          </p>
        </div>
      </div>

      {/* Seller and Buyer Info */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <h2 className="font-semibold bg-gray-800 text-white p-2">Seller</h2>
          <div className="border p-4">
            <p>Electronify</p>
            <p>electronify@example.com</p>
            <p>+16265904560</p>
          </div>
        </div>
        <div>
          <h2 className="font-semibold bg-gray-800 text-white p-2">Buyer</h2>
          <div className="border p-4">
            <p>Schmitt-Hahn</p>
            <p>10561 Neil Place East, Bridgetteberg, OK</p>
            <p>81485-5527</p>
            <p>+16068253645</p>
            <p>whegmann@example.org</p>
          </div>
        </div>
      </div>

      {/* Product Table */}
      <table className="w-full border-collapse mb-6">
        <thead>
          <tr className="bg-gray-800 text-white">
            <th className="border p-2">#</th>
            <th className="border p-2">Product</th>
            <th className="border p-2">Quantity</th>
            <th className="border p-2">MRP</th>
            <th className="border p-2">Unit Price</th>
            <th className="border p-2">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border p-2 text-center">1</td>
            <td className="border p-2">Champion Men's Pant</td>
            <td className="border p-2 text-center">3 pc</td>
            <td className="border p-2 text-right">$15.19</td>
            <td className="border p-2 text-right">$12.99</td>
            <td className="border p-2 text-right">$38.97</td>
          </tr>
          <tr>
            <td className="border p-2 text-center">2</td>
            <td className="border p-2">ASUS VivoBook 15</td>
            <td className="border p-2 text-center">6 pc</td>
            <td className="border p-2 text-right">$42</td>
            <td className="border p-2 text-right">$39</td>
            <td className="border p-2 text-right">$234</td>
          </tr>
          <tr>
            <td className="border p-2 text-center">3</td>
            <td className="border p-2">Furinno Frame Computer Desk</td>
            <td className="border p-2 text-center">7 pc</td>
            <td className="border p-2 text-right">$49</td>
            <td className="border p-2 text-right">$43</td>
            <td className="border p-2 text-right">$301</td>
          </tr>
        </tbody>
      </table>

      {/* Payment Status */}
      <div className="border p-4 mb-6">
        <h3 className="font-semibold">Payment Status: Partially Paid</h3>
        <p>Paid Amount: $317</p>
        <p>Due Amount: $256.97</p>
        <p>Payment Mode: $317 (Cash)</p>
      </div>

      {/* Total and Summary */}
      <div className="flex justify-between border p-4 mb-6">
        <div>
          <p>
            Subtotal: <span className="font-medium">$573.97</span>
          </p>
          <p>
            Tax: <span className="font-medium">$0 (0%)</span>
          </p>
          <p>
            Discount: <span className="font-medium">$0</span>
          </p>
          <p>
            Shipping: <span className="font-medium">$0</span>
          </p>
          <p className="font-semibold">Total: $573.97</p>
        </div>
        <p className="text-right">Authorized Person</p>
      </div>

      {/* Footer */}
      <div className="border-t pt-4 text-sm text-gray-600">
        <p>Terms & Conditions</p>
        <p>1. Goods once sold will not be taken back or exchanged.</p>
        <p>
          2. All disputes are subject to [ENTER_YOUR_CITY_NAME] jurisdiction
          only.
        </p>
      </div>
    </div>
  );
};

export default Template2;
