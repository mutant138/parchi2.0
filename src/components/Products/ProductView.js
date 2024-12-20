import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useSelector } from "react-redux";

function ProductsView() {
  const navigate = useNavigate();
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const userDetails = useSelector((state) => state.users);
  const companyDetails = userDetails.companies[userDetails.selectedCompanyIndex];

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productRef = doc(
          db,
          "companies",
          companyDetails.companyId,
          "products",
          productId
        );
        const productDoc = await getDoc(productRef);
        if (productDoc.exists()) {
          setProduct({ id: productDoc.id, ...productDoc.data() });
        } else {
          console.error("No such document!");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return <div className="flex items-center justify-center h-full">Loading product...</div>;
  }

  if (!product) {
    return <div className="flex items-center justify-center h-full">Product not found.</div>;
  }
console.log(product);
  const columns = [
    { id: 1, label: "Name" },
    { id: 2, label: "Description" },
    { id: 3, label: "Unit Price" },
    { id: 4, label: "Discount" },
    { id: 5, label: "Gst Tax" },
    { id: 6, label: "Purchase Price" },
    { id: 7, label: "Includes Tax" },
    { id: 8, label: "Quantity" },
    { id: 9, label: "Actions" },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md">
        <div className="p-5">
          {/* Left-aligned "Products" heading */}
          <h1 className="text-2xl font-semibold text-gray-900 text-left">Products</h1>

          <div className="mt-5">
            <h2 className="text-lg font-semibold text-gray-900">Product Details</h2>
            <p className="text-lg text-gray-800 mt-1">{product.name}</p>
          </div>
        </div>

        <div className="mt-6 overflow-hidden border rounded-lg">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                {columns.map((column) => (
                  <th key={column.id} className="p-3 text-left font-medium text-gray-700">
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-3">{product.name}</td>
                <td className="p-3">{product.description}</td>
                <td className="p-3">₹{product.sellingPrice}</td>
                <td className="p-3">
                  {product.discountType ? `${product.discount}%` : `₹${product.discount}`}
                </td>
                <td className="p-3">{product.tax}%</td>
                <td className="p-3">₹{product.purchasePrice}</td>
                <td className="p-3">{product.sellingPriceTaxType ? "Yes" : "No"}</td>
                <td className="p-3">{product.stock}</td>
                <td className="p-3">
                  {/* Add action buttons or links as necessary */}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex justify-end p-5">
          <div className="text-right">
            <div className="flex justify-between">
              <span className="text-gray-600 font-medium">Total:</span>
              <span className="font-bold">₹0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductsView;
