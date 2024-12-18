import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
  Timestamp,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { db } from "../../../firebase";
import { useSelector } from "react-redux";
import { AiOutlineArrowLeft } from "react-icons/ai";

const CreatePOS = () => {
  const userDetails = useSelector((state) => state.users);

  const companyDetails =
    userDetails.companies[userDetails.selectedCompanyIndex];

  const phoneNo = userDetails.phone;

  const [POSDate, setPOSDate] = useState(new Date());
  const [taxSelect, setTaxSelect] = useState("");
  const [selectedTaxDetails, setSelectedTaxDetails] = useState({});
  const [total_Tax_Amount, setTotal_Tax_Amount] = useState(0);
  const [taxTypeOptions, setTaxTypeOptions] = useState({
    tds: [],
    tcs: [],
  });

  const [products, setProducts] = useState([]);
  const [prePOSList, setPrePOSList] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    discount: 0,
    paymentStatus: "UnPaid",
    notes: "",
    POSNo: "",
    packagingCharges: 0,
    subTotal: 0,
    tds: {},
    total: 0,
    shippingCharges: 0,
    tax: 0,
    attachments: [],
    tcs: {},
    terms: "",
  });

  const [totalAmounts, setTotalAmounts] = useState({
    totalTaxableAmount: 0,
    totalSgstAmount_2_5: 0,
    totalCgstAmount_2_5: 0,
    totalSgstAmount_6: 0,
    totalCgstAmount_6: 0,
    totalSgstAmount_9: 0,
    totalCgstAmount_9: 0,
    totalAmount: 0,
  });

  const [customersData, setCustomersData] = useState([]);
  const [selectedCustomerData, setSelectedCustomerData] = useState({
    name: "",
  });

  const [suggestions, setSuggestions] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productRef = collection(
          db,
          "companies",
          companyDetails.companyId,
          "inventories"
        );
        const querySnapshot = await getDocs(productRef);
        const productsData = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          const netAmount =
            +data.pricing.sellingPrice?.amount -
            (+data.pricing.discount?.amount || 0);
          const taxRate = data.pricing.gstTax || 0;
          const sgst = taxRate / 2;
          const cgst = taxRate / 2;
          const taxAmount = netAmount * (taxRate / 100);
          const sgstAmount = netAmount * (sgst / 100);
          const cgstAmount = netAmount * (cgst / 100);

          return {
            id: doc.id,
            itemName: data.itemName || "N/A",
            quantity: data.stock?.quantity ?? 0,
            unitPrice: data.pricing.sellingPrice?.amount ?? 0,
            discount: data.pricing.discount?.amount ?? 0,
            gstTax: data.pricing.gstTax,
            fieldValue: data.pricing.discount?.fieldValue ?? 0,
            actionQty: 0,
            totalAmount: 0,
            netAmount: netAmount,
            sgst,
            cgst,
            sgstAmount,
            cgstAmount,
            taxAmount,
            taxSlab: data.pricing.sellingPrice?.taxSlab,
          };
        });
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching POSs:", error);
      }
    };

    async function customerDetails() {
      try {
        const customersRef = collection(db, "customers");
        const q = query(
          customersRef,
          where(
            "companyRef",
            "==",
            doc(db, "companies", companyDetails.companyId)
          )
        );
        const company = await getDocs(q);
        const customerData = company.docs.map((doc) => ({
          customerId: doc.id,
          ...doc.data(),
        }));
        setCustomersData(customerData);
        setSuggestions(customerData);
      } catch (error) {
        console.log("🚀 ~ customerDetails ~ error:", error);
      }
    }

    async function fetchTax() {
      try {
        const tdsRef = collection(db, "tds");
        const tdsQuerySnapshot = await getDocs(tdsRef);
        const tdsData = tdsQuerySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            natureOfPayment: data.payment_nature,
            percentage: data.percentage,
            percentageValue: data.percentage_value,
            tdsSection: data.tds_section,
          };
        });
        const tcsRef = collection(db, "tcs_tax");
        const tcsQuerySnapshot = await getDocs(tcsRef);
        const tcsData = tcsQuerySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            tax: data.tax,
            tax_value: data.tax_value,
            type_of_goods: data.type_of_goods,
          };
        });

        setTaxTypeOptions({
          tds: tdsData,
          tcs: tcsData,
        });
      } catch (error) {
        console.log("🚀 ~ fetchTDC ~ error:", error);
      }
    }

    const fetchPOSNumbers = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(db, "companies", companyDetails.companyId, "POSs")
        );

        const noList = querySnapshot.docs.map((doc) => doc.data().POSNo);
        setPrePOSList(noList);
        setFormData((val) => ({
          ...val,
          POSNo: String(noList.length + 1).padStart(4, 0),
        }));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    async function fetchBooks() {
      try {
        const bookRef = collection(
          db,
          "companies",
          companyDetails.companyId,
          "books"
        );
        const getBookData = await getDocs(bookRef);
        const fetchBooks = getBookData.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBooks(fetchBooks);
      } catch (error) {
        console.log("🚀 ~ fetchBooks ~ error:", error);
      }
    }
    fetchBooks();
    fetchPOSNumbers();
    fetchTax();
    customerDetails();
    fetchProducts();
  }, [companyDetails]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSelectedCustomerData({ name: e.target.value });
    if (value) {
      const filteredSuggestions = customersData.filter((item) =>
        item.name.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
      setIsDropdownVisible(true);
    } else {
      setSuggestions(customersData);
    }
  };

  const handleSelectCustomer = (item) => {
    setSelectedCustomerData(item);
    setIsDropdownVisible(false);
  };

  function handleActionQty(op, productId) {
    let updatedProducts = products.map((product) => {
      if (product.id === productId) {
        if (op === "+") {
          if (product.quantity > product.actionQty) {
            ++product.actionQty;
          }
        } else {
          if (0 < product.actionQty) {
            --product.actionQty;
          }
        }
        product.actionQty = Math.max(product.actionQty, 0);
        product.totalAmount = product.netAmount * product.actionQty;
      }

      return product;
    });
    const totalTaxableAmount = updatedProducts.reduce(
      (sum, product) => sum + product.netAmount * product.actionQty,
      0
    );

    const totalSgstAmount_2_5 = updatedProducts.reduce(
      (sum, product) =>
        product.sgst === 2.5
          ? sum + product.sgstAmount * product.actionQty
          : sum,
      0
    );
    const totalCgstAmount_2_5 = updatedProducts.reduce(
      (sum, product) =>
        product.cgst === 2.5
          ? sum + product.cgstAmount * product.actionQty
          : sum,
      0
    );

    const totalSgstAmount_6 = updatedProducts.reduce(
      (sum, product) =>
        product.sgst === 6 ? sum + product.sgstAmount * product.actionQty : sum,
      0
    );
    const totalCgstAmount_6 = updatedProducts.reduce(
      (sum, product) =>
        product.cgst === 6 ? sum + product.cgstAmount * product.actionQty : sum,
      0
    );

    const totalSgstAmount_9 = updatedProducts.reduce(
      (sum, product) =>
        product.sgst === 9 ? sum + product.sgstAmount * product.actionQty : sum,
      0
    );
    const totalCgstAmount_9 = updatedProducts.reduce(
      (sum, product) =>
        product.cgst === 9 ? sum + product.cgstAmount * product.actionQty : sum,
      0
    );

    const totalAmount =
      totalTaxableAmount +
      totalSgstAmount_2_5 +
      totalCgstAmount_2_5 +
      totalSgstAmount_6 +
      totalCgstAmount_6 +
      totalSgstAmount_9 +
      totalCgstAmount_9;

    setProducts(updatedProducts);
    setTotalAmounts({
      totalTaxableAmount,
      totalSgstAmount_2_5,
      totalCgstAmount_2_5,
      totalSgstAmount_6,
      totalCgstAmount_6,
      totalSgstAmount_9,
      totalCgstAmount_9,
      totalAmount,
    });
  }

  function total_TCS_TDS_Amount() {
    const totalQty = products.reduce((acc, cur) => {
      return acc + cur.actionQty;
    }, 0);
    if (taxSelect === "" || !selectedTaxDetails.id || totalQty === 0) {
      return;
    }

    const amount =
      taxSelect === "tcs"
        ? selectedTaxDetails.tax_value
        : selectedTaxDetails.percentageValue;
    const totalTaxAmount = amount * totalQty;
    setTotal_Tax_Amount(totalTaxAmount);
  }

  function onSelectBook(e) {
    const { value } = e.target;
    const data = books.find((ele) => ele.id === value);
    const bookRef = doc(
      db,
      "companies",
      companyDetails.companyId,
      "books",
      value
    );
    setFormData((val) => ({
      ...val,
      book: { id: value, name: data.name, bookRef },
    }));
  }

  useEffect(() => {
    total_TCS_TDS_Amount();
  }, [products, selectedTaxDetails]);

  async function onCreatePOS() {
    try {
      if (!selectedCustomerData.customerId) {
        return;
      }
      const customerRef = doc(db, "customers", selectedCustomerData.customerId);
      const companyRef = doc(db, "companies", companyDetails.companyId);
      let subTotal = 0;
      const items = [];
      for (const product of products) {
        if (product.actionQty === 0) {
          continue;
        }
        const productRef = doc(
          db,
          "companies",
          companyDetails.companyId,
          "inventories",
          product.id
        );
        subTotal += product.totalAmount;
        items.push({
          quantity: product.actionQty,
          desc: "",
          pricing: {
            gstTax: product.gstTax,
            purchasePrice: {
              includingTax: true,
              amount: product.unitPrice,
              taxSlab: product.taxSlab,
            },
            sellingPrice: {
              amount: product.unitPrice,
              taxAmount: product.totalAmount,
              taxSlab: product.taxSlab,
              includingTax: true,
            },
            discount: {
              amount: product.discount,
              fieldValue: product.fieldValue,
              type: "Percentage",
            },
          },
          name: product.itemName,
          productRef: productRef,
        });
      }
      let tcs = {
        isTcsApplicable: Boolean(taxSelect === "tcs"),
        tax: taxSelect === "tcs" ? selectedTaxDetails.tax : "",
        tax_value: taxSelect === "tcs" ? selectedTaxDetails.tax_value : 0,
        type_of_goods:
          taxSelect === "tcs" ? selectedTaxDetails.type_of_goods : "",
        tcs_amount: taxSelect === "tcs" ? total_Tax_Amount : 0,
      };

      let tds = {
        isTdsApplicable: Boolean(taxSelect === "tds"),
        natureOfPayment:
          taxSelect === "tds" ? selectedTaxDetails.natureOfPayment : "",
        percentage: taxSelect === "tds" ? selectedTaxDetails.percentage : 0,
        percentageValue:
          taxSelect === "tds" ? selectedTaxDetails.percentageValue : "",
        tdsSection: taxSelect === "tds" ? selectedTaxDetails.tdsSection : "",
        tds_amount: taxSelect === "tds" ? total_Tax_Amount : 0,
      };

      const payload = {
        ...formData,
        tds,
        tcs,
        date: Timestamp.fromDate(POSDate),
        createdBy: {
          companyRef: companyRef,
          name: companyDetails.name,
          address: {},
          phoneNo: phoneNo,
        },
        subTotal: +subTotal,
        total:
          +totalAmounts.totalAmount +
          formData.shippingCharges +
          formData.packagingCharges +
          total_Tax_Amount,
        items: items,
        customerDetails: {
          gstNumber: "",
          custRef: customerRef,
          address: selectedCustomerData.address,
          phoneNumber: selectedCustomerData.phone,
          name: selectedCustomerData.name,
        },
      };

      await addDoc(
        collection(db, "companies", companyDetails.companyId, "pos"),
        payload
      );

      for (const item of items) {
        if (item.quantity === 0) {
          continue;
        }

        const currentQuantity = products.find(
          (val) => val.itemName === item.name
        ).quantity;

        if (currentQuantity <= 0) {
          alert("Product is out of stock!");
          throw new Error("Product is out of stock!");
        }

        await updateDoc(item.productRef, {
          "stock.quantity": currentQuantity - item.quantity,
        });
      }

      alert("Successfully Created the POS");
      navigate("/pos");
    } catch (err) {
      console.error(err);
    }
  }

  function onSelect_TDS_TCS(e) {
    const taxId = e.target.value;
    let taxDetails = taxTypeOptions[taxSelect].find((ele) => ele.id === taxId);
    setSelectedTaxDetails(taxDetails);
  }

  function setCurrentDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  return (
    <div
      className="px-5 pb-5 bg-gray-100 overflow-y-auto"
      style={{ height: "92vh" }}
    >
      <header className="flex items-center space-x-3  my-2">
        <Link
          className="flex items-center bg-gray-300 text-gray-700 py-1 px-4 rounded-full transform hover:bg-gray-400 hover:text-white transition duration-200 ease-in-out"
          to={"./../"}
        >
          <AiOutlineArrowLeft className="w-5 h-5 mr-2" />
        </Link>
        <h1 className="text-2xl font-bold">Create POS</h1>
      </header>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex gap-8 mb-6">
          <div className="flex-1">
            <h2 className="font-semibold mb-2">Customer Details</h2>
            <div className="bg-blue-50 p-4 rounded-lg">
              <label className="text-sm text-gray-600">Select Customer</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search your Customers, Company Name, GSTIN..."
                  className="text-base text-gray-900 font-semibold border p-1 rounded w-full mt-1"
                  value={selectedCustomerData?.name}
                  onChange={handleInputChange}
                  onFocus={() => setIsDropdownVisible(true)}
                  onBlur={() => {
                    if (!selectedCustomerData.customerId) {
                      setSelectedCustomerData({ name: "" });
                    }
                    setIsDropdownVisible(false);
                  }}
                />
                {isDropdownVisible && suggestions.length > 0 && (
                  <div className="absolute z-20 bg-white border border-gray-300 rounded-lg shadow-md max-h-60 overflow-y-auto w-full">
                    {suggestions.map((item) => (
                      <div
                        key={item.customerId}
                        onMouseDown={() => handleSelectCustomer(item)}
                        className="flex flex-col px-4 py-3 text-gray-800 hover:bg-blue-50 cursor-pointer transition-all duration-150 ease-in-out"
                      >
                        <span className="font-medium text-sm">
                          Name:{" "}
                          <span className="font-semibold">{item.name}</span>
                        </span>
                        <span className="text-xs text-gray-600">
                          Phone No.: {item.phone}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex-1">
            <h2 className="font-semibold mb-2">Other Details</h2>
            <div className="grid grid-cols-2 gap-4 bg-pink-50 p-4 rounded-lg">
              <div>
                <label className="text-sm text-gray-600">POS Date</label>
                <input
                  type="date"
                  value={setCurrentDate(POSDate)}
                  className="border p-1 rounded w-full mt-1"
                  onChange={(e) => {
                    setPOSDate(new Date(e.target.value));
                  }}
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">
                  POS No.{" "}
                  {prePOSList.includes(formData.POSNo) && (
                    <span className="text-red-800 text-xs">
                      "Already POS No. exist"{" "}
                    </span>
                  )}
                  {Number(formData.POSNo) == 0 && (
                    <span className="text-red-800 text-xs">
                      "Kindly Enter valid POS No."{" "}
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  placeholder="Enter POS No. "
                  className="border p-1 rounded w-full mt-1"
                  value={formData.POSNo}
                  onChange={(e) => {
                    const { value } = e.target;
                    setFormData((val) => ({
                      ...val,
                      POSNo: value,
                    }));
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <h2 className="font-semibold mb-2">Products & Services</h2>
          <button
              className="bg-blue-500 text-white py-1 px-4 rounded mt-1 ml-auto"
              onClick={() => setIsSidebarOpen(true)}
            >
              + Add Items
            </button>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg shadow-inner mb-6">
          <div className="flex justify-between items-center mb-4 space-x-4">
            <div className="w-full">
              <label className="text-sm text-gray-600">Categories</label>
              <select className="border p-1 rounded w-full">
                <option disabled value="">
                  Select Category
                </option>
              </select>
            </div>
            <div className="w-full">
              <label className="text-sm text-gray-600">Search</label>
              <input
                type="text"
                className="border p-1 rounded w-full"
                placeholder="Search..."
              />
            </div>
          </div>

          <div className="bg-white">
            <div className="mb-4">
              <table className="min-w-full text-center text-gray-500 font-semibold">
                <thead className="border-b bg-gray-50">
                  <tr>
                    <th className="px-4 py-2">Product Name</th>
                    <th className="px-4 py-2">Quantity</th>
                    <th className="px-4 py-2">Unit Price</th>
                    <th className="px-4 py-2">Discount</th>
                    <th className="px-4 py-2">Net Amount</th>
                    <th className="px-4 py-2">Total Amount</th>
                    <th className="px-4 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length > 0 ? (
                    products.map((product) => (
                      <tr key={product.id}>
                        <td className="px-4 py-2">{product.itemName}</td>
                        <td className="px-4 py-2">{product.quantity}</td>
                        <td className="px-4 py-2">₹{product.unitPrice}</td>
                        <td className="px-4 py-2">₹{product.discount}</td>
                        <td className="px-4 py-2">₹{product.netAmount}</td>
                        <td className="px-4 py-2">₹{product.totalAmount}</td>
                        <td className="px-4 py-2">
                          {product.actionQty >= 1 && (
                            <>
                              <button
                                className="bg-blue-500 text-white rounded w-1/5"
                                onClick={() => handleActionQty("-", product.id)}
                              >
                                -
                              </button>
                              <span className="px-2">{product.actionQty}</span>{" "}
                            </>
                          )}
                          <button
                            className="bg-blue-500 text-white  rounded w-1/5 "
                            onClick={() => handleActionQty("+", product.id)}
                            disabled={product.quantity === 0}
                          >
                            +
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="py-10 text-center">
                        No Product Selected
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="w-full mt-4 border-t pt-4 bg-gray-50 p-4 ">
              <div className="w-full grid grid-cols-3 gap-4">
                <div className="w-full ">
                  <div>Dispatch From</div>
                  <select
                    value=""
                    onChange={() => {}}
                    className="border p-2 rounded w-full"
                  >
                    <option value="" disabled>
                      Select WareHouse
                    </option>
                  </select>
                </div>
                <div className="w-full ">
                  <div>Bank/Book</div>
                  <select
                    defaultValue=""
                    onChange={onSelectBook}
                    className="border p-2 rounded w-full"
                  >
                    <option value="" disabled>
                      Select Bank/Book
                    </option>
                    {books.length > 0 &&
                      books.map((book) => (
                        <option value={book.id} key={book.id}>
                          {`${book.name} - ${book.bankName} - ${book.branch}`}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="w-full ">
                  <div>Sign</div>
                  <select
                    value=""
                    onChange={() => {}}
                    className="border p-2 rounded w-full"
                  >
                    <option value="" disabled>
                      Select Sign
                    </option>
                  </select>
                </div>
                <div className="w-full ">
                  <div>Shipping Charges</div>
                  <input
                    type="number"
                    placeholder="Shipping Charges"
                    className="border p-2 rounded w-full"
                    onChange={(e) => {
                      setFormData((val) => ({
                        ...val,
                        shippingCharges: +e.target.value,
                      }));
                    }}
                  />
                </div>
                <div className="w-full ">
                  <div>Packaging Charges</div>
                  <input
                    type="number"
                    placeholder="Packaging Charges"
                    className="border p-2 rounded w-full"
                    onChange={(e) => {
                      setFormData((val) => ({
                        ...val,
                        packagingCharges: +e.target.value,
                      }));
                    }}
                  />
                </div>
                <div className="w-full ">
                  <div>Attach Files</div>

                  <input
                    type="file"
                    className="flex h-10 w-full rounded-md border border-input
                  bg-white px-3 py-2 text-sm text-gray-400 file:border-0
                  file:bg-transparent file:text-gray-600 file:text-sm
                  file:font-medium"
                  />
                </div>
                <div className="w-full ">
                  <div>Notes</div>
                  <input
                    type="text"
                    placeholder="Notes"
                    className="border p-2 rounded w-full"
                    onChange={(e) => {
                      setFormData((val) => ({
                        ...val,
                        notes: e.target.value,
                      }));
                    }}
                  />
                </div>
                <div className="w-full ">
                  <div>Terms</div>
                  <textarea
                    type="text"
                    className="border p-2 rounded w-full max-h-16 min-h-16"
                    onChange={(e) => {
                      setFormData((val) => ({
                        ...val,
                        terms: e.target.value,
                      }));
                    }}
                  />
                </div>
                <div className="w-full flex justify-between items-center">
                  <div>TDS</div>
                  <div>
                    <label className="relative inline-block w-14 h-8">
                      <input
                        type="checkbox"
                        name="tds"
                        className="sr-only peer"
                        checked={taxSelect === "tds"}
                        onChange={(e) => {
                          setTaxSelect((val) => (val === "tds" ? "" : "tds"));
                          setSelectedTaxDetails({});
                          setTotal_Tax_Amount(0);
                        }}
                      />
                      <span className="absolute cursor-pointer inset-0 bg-[#9fccfa] rounded-full transition-all duration-400 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] peer-focus:ring-2 peer-focus:ring-[#0974f1] peer-checked:bg-[#0974f1]"></span>
                      <span className="absolute top-0 left-0 h-8 w-8 bg-white rounded-full shadow-[0_10px_20px_rgba(0,0,0,0.4)] transition-all duration-400 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] flex items-center justify-center peer-checked:translate-x-[1.6em]"></span>
                    </label>
                  </div>
                  <div>TCS</div>
                  <div>
                    <label className="relative inline-block w-14 h-8">
                      <input
                        type="checkbox"
                        name="tcs"
                        className="sr-only peer"
                        checked={taxSelect === "tcs"}
                        onChange={(e) => {
                          setTaxSelect((val) => (val === "tcs" ? "" : "tcs"));
                          setSelectedTaxDetails({});
                          setTotal_Tax_Amount(0);
                        }}
                      />
                      <span className="absolute cursor-pointer inset-0 bg-[#9fccfa] rounded-full transition-all duration-400 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] peer-focus:ring-2 peer-focus:ring-[#0974f1] peer-checked:bg-[#0974f1]"></span>
                      <span className="absolute top-0 left-0 h-8 w-8 bg-white rounded-full shadow-[0_10px_20px_rgba(0,0,0,0.4)] transition-all duration-400 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] flex items-center justify-center peer-checked:translate-x-[1.6em]"></span>
                    </label>
                  </div>
                  <div>
                    <select
                      className="border p-2 rounded w-full"
                      onChange={(e) =>
                        setFormData((val) => ({ ...val, mode: e.target.value }))
                      }
                    >
                      <option value="Cash">Cash</option>
                      <option value="Emi">Emi</option>
                      <option value="Cheque">Cheque</option>
                      <option value="Net Banking">Net Banking</option>
                      <option value="Credit/Debit Card">
                        Credit/Debit Card
                      </option>
                    </select>
                  </div>
                </div>
              </div>
              <div>
                <div className="w-full flex ">
                  {taxSelect === "tds" && (
                    <select
                      className="border p-2 rounded w-full focus:outline-none"
                      defaultValue=""
                      onChange={onSelect_TDS_TCS}
                    >
                      <option value="" disabled>
                        Select {taxSelect.toUpperCase()} Option
                      </option>
                      {taxTypeOptions.tds.map((ele) => (
                        <option key={ele.id} value={ele.id}>
                          {ele.natureOfPayment} {ele.percentage}
                        </option>
                      ))}
                    </select>
                  )}
                  {taxSelect === "tcs" && (
                    <select
                      className="border p-2 rounded w-full focus:outline-none"
                      defaultValue=""
                      onChange={onSelect_TDS_TCS}
                    >
                      <option value="" disabled>
                        Select {taxSelect.toUpperCase()} Option
                      </option>
                      {taxTypeOptions.tcs.map((ele) => (
                        <option key={ele.id} value={ele.id}>
                          {ele.type_of_goods} {ele.tax}
                        </option>
                      ))}
                    </select>
                  )}
                  {(taxSelect === "tds" || taxSelect === "tcs") && (
                    <div className="border p-2 rounded w-1/5">
                      ₹ {total_Tax_Amount}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-end items-center mt-4 border-t pt-4 bg-gray-50 p-4 ">
              {/* <div className="flex items-center gap-2">
                <label className="text-gray-600">
                  Apply discount (%) to all items?
                </label>
                <input
                  type="text"
                  className="border border-green-500 p-1 rounded w-16"
                  placeholder="%"
                  onChange={(e) =>
                    setFormData((val) => ({ ...val, discount: e.target.value }))
                  }
                />
              </div> */}

              <div className="flex flex-col justify-between">
                <div className=" p-6" style={{ width: "600px" }}>
                  {/* <div className="flex items-center mb-4">
                    <label className="mr-2">Extra Discount</label>
                    <input
                      type="text"
                      placeholder="%"
                      className="border p-1 rounded w-16 text-center"
                    />
                  </div> */}
                  {formData.shippingCharges > 0 && (
                    <div className="flex justify-between text-gray-700 mb-2">
                      <span>Shipping Charges</span>
                      <span>₹ {formData.shippingCharges.toFixed(2)}</span>
                    </div>
                  )}
                  {formData.packagingCharges > 0 && (
                    <div className="flex justify-between text-gray-700 mb-2">
                      <span>Packaging Charges</span>
                      <span>₹ {formData.packagingCharges.toFixed(2)}</span>
                    </div>
                  )}
                  {taxSelect !== "" && (
                    <div className="flex justify-between text-gray-700 mb-2">
                      <span>{taxSelect.toUpperCase()}</span>
                      <span>₹ {total_Tax_Amount.toFixed(2)}</span>
                    </div>
                  )}

                  {totalAmounts.totalTaxableAmount > 0 && (
                    <div className="flex justify-between text-gray-700 mb-2">
                      <span>Taxable Amount</span>
                      <span>
                        ₹ {totalAmounts.totalTaxableAmount.toFixed(2)}
                      </span>
                    </div>
                  )}
                  {totalAmounts.totalSgstAmount_2_5 > 0 && (
                    <div className="flex justify-between text-gray-700 mb-2">
                      <span>SGST(2.5%)</span>
                      <span>
                        ₹ {totalAmounts.totalSgstAmount_2_5.toFixed(2)}
                      </span>
                    </div>
                  )}
                  {totalAmounts.totalCgstAmount_2_5 > 0 && (
                    <div className="flex justify-between text-gray-700 mb-2">
                      <span>CGST(2.5%)</span>
                      <span>
                        ₹ {totalAmounts.totalCgstAmount_2_5.toFixed(2)}
                      </span>
                    </div>
                  )}
                  {totalAmounts.totalSgstAmount_6 > 0 && (
                    <div className="flex justify-between text-gray-700 mb-2">
                      <span>SGST(6%)</span>
                      <span>₹ {totalAmounts.totalSgstAmount_6.toFixed(2)}</span>
                    </div>
                  )}
                  {totalAmounts.totalCgstAmount_6 > 0 && (
                    <div className="flex justify-between text-gray-700 mb-2">
                      <span>CGST(6%)</span>
                      <span>₹ {totalAmounts.totalCgstAmount_6.toFixed(2)}</span>
                    </div>
                  )}
                  {totalAmounts.totalSgstAmount_9 > 0 && (
                    <div className="flex justify-between text-gray-700 mb-2">
                      <span>SGST(9%)</span>
                      <span>₹ {totalAmounts.totalSgstAmount_9.toFixed(2)}</span>
                    </div>
                  )}
                  {totalAmounts.totalCgstAmount_9 > 0 && (
                    <div className="flex justify-between text-gray-700 mb-2">
                      <span>CGST(9%)</span>
                      <span>₹ {totalAmounts.totalCgstAmount_9.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between font-bold text-xl mb-2">
                    <span>Total Amount</span>
                    <span>
                      ₹{" "}
                      {(
                        totalAmounts.totalAmount +
                        formData.shippingCharges +
                        formData.packagingCharges +
                        total_Tax_Amount
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <div className="flex gap-2">
            <button
              className="bg-blue-500 text-white py-1 px-4 rounded-lg flex items-center gap-1"
              onClick={onCreatePOS}
            >
              <span className="text-lg">+</span> Create POS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePOS;
