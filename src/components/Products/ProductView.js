import React, { useEffect, useState } from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { Link, useParams } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, storage } from "../../firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useSelector } from "react-redux";
import { FaUserEdit } from "react-icons/fa";

const ProductView = () => {
  const { id: productId } = useParams();
  const userDetails = useSelector((state) => state.users);
  const companyDetails = userDetails.companies[userDetails.selectedCompanyIndex];
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const [updatedData, setUpdatedData] = useState({});
  const [progress, setProgress] = useState(0);

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
          setUpdatedData({ id: productDoc.id, ...productDoc.data() });
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

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const storageRef = ref(storage, `productImages/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progressPercent =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(progressPercent);
          },
          (error) => {
            console.error("Upload failed:", error);
          },
          async () => {
            const downloadURL = await getDownloadURL(storageRef);
            const productRef = doc(db, "companies", companyDetails.companyId, "products", productId);
            await updateDoc(productRef, { imageUrl: downloadURL });
            setUpdatedData((prev) => ({ ...prev, imageUrl: downloadURL }));
            alert("Product image updated successfully");
            setProgress(0);
          }
        );
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };

  const onUpdateProduct = async () => {
    try {
      const productRef = doc(db, "companies", companyDetails.companyId, "products", productId);
      const { id, ...rest } = updatedData;
      await updateDoc(productRef, rest);
      alert("Product updated successfully");
      setIsEdit(false);
    } catch (error) {
      console.log("🚀 ~ onUpdateProduct ~ error:", error);
    }
  };

  const onCancelEdit = () => {
    setUpdatedData(product);
    setIsEdit(false);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-full">Loading product...</div>;
  }

  if (!product) {
    return <div className="flex items-center justify-center h-full">Product not found.</div>;
  }

  const subTotal = product.sellingPrice * product.stock;
  const taxAmount = (subTotal * product.tax) / 100;
  const total = subTotal + taxAmount;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md">
        <div className="p-5 border-b flex items-center">
          <Link
            className="text-gray-700 py-1 px-2 rounded-full hover:bg-gray-200 transition duration-200"
            to={"/products"}
          >
            <AiOutlineArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900 ml-4">Product Details</h1>
          <p className="text-sm text-gray-600 mt-1 ml-auto">Date: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="p-6">
          {progress > 0 && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-orange-500 h-2 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          )}
          <div className="flex items-center space-x-6 mb-6">
            {updatedData.imageUrl ? (
              <img
                src={updatedData.imageUrl}
                alt="Product"
                className="w-20 h-20 rounded-full object-cover shadow-md"
              />
            ) : (
              <span className="bg-purple-500 text-white w-20 h-20 flex items-center justify-center rounded-full text-2xl shadow-md">
                {updatedData.name.charAt(0).toUpperCase()}
              </span>
            )}
            <div className="flex-1">
              <div className="text-2xl font-semibold">
                {isEdit ? (
                  <input
                    type="text"
                    value={updatedData.name}
                    className="border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:ring focus:ring-purple-200"
                    onChange={(e) =>
                      setUpdatedData((val) => ({
                        ...val,
                        name: e.target.value,
                      }))
                    }
                  />
                ) : (
                  updatedData.name || "N/A"
                )}
              </div>
              {!isEdit && (
                <button
                  className="flex items-center space-x-2 text-purple-600 hover:text-purple-800 mt-2"
                  onClick={() => setIsEdit(true)}
                >
                  <FaUserEdit />
                  <span>Edit Product</span>
                </button>
              )}
              {isEdit && (
                <input
                  type="file"
                  className="flex mt-3 h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-gray-400 file:border-0 file:bg-transparent file:text-gray-600 file:text-sm file:font-medium"
                  onChange={handleFileChange}
                />
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-gray-700 font-medium mb-2">Product Info</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-500">Quantity</label>
                  <input
                    type="text"
                    value={updatedData.stock || (isEdit ? "" : "N/A")}
                    className={`block w-full border-gray-300 p-2 rounded-md focus:ring focus:ring-purple-200 ${
                      isEdit ? "border" : "bg-gray-100"
                    }`}
                    onChange={(e) =>
                      setUpdatedData((val) => ({
                        ...val,
                        stock: e.target.value,
                      }))
                    }
                    readOnly={!isEdit}
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-500">Discount</label>
                  <input
                    type="text"
                    value={updatedData.discount || (isEdit ? "" : "N/A")}
                    className={`block w-full border-gray-300 p-2 rounded-md focus:ring focus:ring-purple-200 ${
                      isEdit ? "border" : "bg-gray-100"
                    }`}
                    onChange={(e) =>
                      setUpdatedData((val) => ({
                        ...val,
                        discount: e.target.value,
                      }))
                    }
                    readOnly={!isEdit}
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-500">GST Tax</label>
                  <input
                    type="text"
                    value={updatedData.tax || (isEdit ? "" : "N/A")}
                    className={`block w-full border-gray-300 p-2 rounded-md focus:ring focus:ring-purple-200 ${
                      isEdit ? "border" : "bg-gray-100"
                    }`}
                    onChange={(e) =>
                      setUpdatedData((val) => ({
                        ...val,
                        tax: e.target.value,
                      }))
                    }
                    readOnly={!isEdit}
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-gray-700 font-medium mb-2">Pricing Info</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-500">Unit Price</label>
                  <input
                    type="text"
                    value={updatedData.sellingPrice || (isEdit ? "" : "N/A")}
                    className={`block w-full border-gray-300 p-2 rounded-md focus:ring focus:ring-purple-200 ${
                      isEdit ? "border" : "bg-gray-100"
                    }`}
                    onChange={(e) =>
                      setUpdatedData((val) => ({
                        ...val,
                        sellingPrice: e.target.value,
                      }))
                    }
                    readOnly={!isEdit}
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-500">Purchase Price</label>
                  <input
                    type="text"
                    value={updatedData.purchasePrice || (isEdit ? "" : "N/A")}
                    className={`block w-full border-gray-300 p-2 rounded-md focus:ring focus:ring-purple-200 ${
                      isEdit ? "border" : "bg-gray-100"
                    }`}
                    onChange={(e) =>
                      setUpdatedData((val) => ({
                        ...val,
                        purchasePrice: e.target.value,
                      }))
                    }
                    readOnly={!isEdit}
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-500">Includes Tax</label>
                  <input
                    type="text"
                    value={updatedData.sellingPriceTaxType ? "Yes" : "No"}
                    className={`block w-full border-gray-300 p-2 rounded-md focus:ring focus:ring-purple-200 ${
                      isEdit ? "border" : "bg-gray-100"
                    }`}
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>

          {isEdit && (
            <div className="mt-6 flex justify-end space-x-4">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-md"
                onClick={onCancelEdit}
              >
                Cancel
              </button>
              <button
                className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
                onClick={onUpdateProduct}
              >
                Save Changes
              </button>
            </div>
          )}

          <div className="p-5 border-t mt-5">
            <div className="flex justify-between text-gray-800">
              <div>
                <p className="font-medium">Sub Total:</p>
                <p className="font-medium">TAX Amount:</p>
                <p className="font-medium">Purchase Total:</p>
                <p className="font-medium">Total:</p>
              </div>
              <div className="text-right">
                <p>₹{subTotal.toFixed(2)}</p>
                <p>₹{taxAmount.toFixed(2)}</p>
                <p>₹{(product.purchasePrice * product.stock).toFixed(2)}</p>
                <p className="font-semibold">₹{total.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductView;