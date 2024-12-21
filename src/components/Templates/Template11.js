import React, { forwardRef } from "react";

const Template11 = forwardRef((props, ref) => {
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
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-700">Invoice</h1>
          <div className="">
            <span className="text-3xl font-bold text-primary-600">
              {invoiceData?.createdBy?.name}
            </span>
          </div>
        </header>

        <section className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-sm font-bold text-gray-600">INVOICE NUMBER</h2>
            <p className="text-sm text-gray-700">{invoiceData.no}</p>
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-600">DATE OF ISSUE</h2>
            <p className="text-sm text-gray-700">
              {" "}
              {DateFormate(invoiceData.dueDate)}
            </p>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-sm font-bold text-gray-600">BILLED TO</h2>
            <p className="text-sm text-gray-700">
              Client name
              <br />
              123 Your Street
              <br />
              City, State, Country
              <br />
              Zip Code
              <br />
              Phone
            </p>
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-600">
              YOUR COMPANY NAME
            </h2>
            <p className="text-sm text-gray-700">
              Building name 123 Your Street
              <br />
              City/State, Country
              <br />
              Zip Code
              <br />
              GSTIN
              <br />
              +1-541-754-3010
              <br />
              you@email.co.uk
              <br />
              yourwebsite.co.uk
            </p>
          </div>
        </section>

        <table className="w-full mb-8 border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2 text-left text-sm font-bold text-gray-600">
                Description
              </th>
              <th className="border border-gray-300 p-2 text-left text-sm font-bold text-gray-600">
                Unit cost
              </th>
              <th className="border border-gray-300 p-2 text-left text-sm font-bold text-gray-600">
                QTY/HR Rate
              </th>
              <th className="border border-gray-300 p-2 text-left text-sm font-bold text-gray-600">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {Array(8)
              .fill()
              .map((_, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 p-2 text-sm text-gray-700">
                    Your item name
                  </td>
                  <td className="border border-gray-300 p-2 text-sm text-gray-700">
                    $0.00
                  </td>
                  <td className="border border-gray-300 p-2 text-sm text-gray-700">
                    1
                  </td>
                  <td className="border border-gray-300 p-2 text-sm text-gray-700">
                    $0.00
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        <section className="flex justify-end mb-8">
          <div className="w-full sm:w-1/2">
            <div className="flex justify-between text-sm text-gray-700 mb-2">
              <span>Subtotal</span>
              <span>$0.00</span>
            </div>
            <div className="flex justify-between text-sm text-gray-700 mb-2">
              <span>Discount</span>
              <span>$0.00</span>
            </div>
            <div className="flex justify-between text-sm text-gray-700 mb-2">
              <span>Tax rate</span>
              <span>%</span>
            </div>
            <div className="flex justify-between text-sm text-gray-700 mb-2">
              <span>Tax</span>
              <span>$0.00</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-gray-900">
              <span>INVOICE TOTAL</span>
              <span>$0.00</span>
            </div>
          </div>
        </section>

        <footer>
          <p className="text-sm text-gray-500">TERMS</p>
        </footer>
      </div>
    </div>
  );
});

export default Template11;
