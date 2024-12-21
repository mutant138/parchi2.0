import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useSelector } from "react-redux";
import { AiOutlineArrowLeft } from "react-icons/ai";

function ProductView() {
  const navigate = useNavigate();
  const { id: productId } = useParams();
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
  }, [productId, companyDetails.companyId]);

  if (loading) {
    return <div className="flex items-center justify-center h-full">Loading product...</div>;
  }

  if (!product) {
    return <div className="flex items-center justify-center h-full">Product not found.</div>;
  }

  const subTotal = product.sellingPrice * product.stock;
  const taxAmount = (subTotal * product.tax) / 100;
  const purchaseTotal = product.purchasePrice * product.stock;
  const total = subTotal + taxAmount;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
        <Link
                className="flex items-center text-gray-700 py-1 px-2 "
                to={"/products"}
              >
                <AiOutlineArrowLeft className="w-5 h-5 mr-2" />
              </Link>
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md">
        <div className="p-5 border-b">
          <h1 className="text-2xl font-semibold text-gray-900">Product Details</h1>
          <p className="text-sm text-gray-600 mt-1">Date: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="overflow-hidden">
          <table className="w-full text-left border-collapse border mt-5">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border">Name</th>
                <th className="p-3 border">Quantity</th>
                <th className="p-3 border">Discount</th>
                <th className="p-3 border">GST Tax</th>
                <th className="p-3 border">Includes Tax</th>
                <th className="p-3 border">Unit Price</th>
                <th className="p-3 border">Purchase Price</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-3 border">{product.name}</td>
                <td className="p-3 border">{product.stock} pcs</td>
                <td className="p-3 border">
                  {product.discountType ? `${product.discount}%` : `₹${product.discount}`}
                </td>
                <td className="p-3 border">{product.tax}%</td>
                <td className="p-3 border">{product.sellingPriceTaxType ? "Yes" : "No"}</td>
                <td className="p-3 border">₹{product.sellingPrice}</td>
                <td className="p-3 border">₹{product.purchasePrice}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="p-5 border-t mt-5">
          <div className="flex justify-between text-gray-800">
            <div>
              <p>Sub Total:</p>
              <p>TAX Amount:</p>
              <p>Purchase Total:</p>
              <p>Total:</p>
            </div>
            <div className="text-right">
              <p>₹{subTotal.toFixed(2)}</p>
              <p>₹{taxAmount.toFixed(2)}</p>
              <p>₹{purchaseTotal.toFixed(2)}</p>
              <p>₹{total.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductView;