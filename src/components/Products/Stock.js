import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { collection, doc, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

const Stock = () => {
  const [lowStockItems, setLowStockItems] = useState([]);
  const [noStockItems, setNoStockItems] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("lowStock"); 
  const [loading, setLoading] = useState(true);
  const userDetails = useSelector((state) => state.users);
  const companyDetails =
    userDetails.companies[userDetails.selectedCompanyIndex];

  const fetchProducts = async () => {
    try {
      const productRef = collection(
        db,
        "companies",
        companyDetails.companyId,
        "products"
      );
      const productSnapshot = await getDocs(productRef);
      const products = productSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log(products);

      // Filter products based on stock quantity
      const lowStock = products.filter(
        (product) => product.stock > 0 && product.stock < 5
      );
      const noStock = products.filter((product) => product.stock === 0);

      setLowStockItems(lowStock);
      setNoStockItems(noStock);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Stock Status</h2>

      {/* Choice Chips */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setSelectedFilter("lowStock")}
          className={`${
            selectedFilter === "lowStock"
              ? "bg-yellow-600 text-white"
              : "bg-gray-200 text-gray-700"
          } px-4 py-2 rounded-lg transition-all`}
        >
          Low Stock
        </button>
        <button
          onClick={() => setSelectedFilter("noStock")}
          className={`${
            selectedFilter === "noStock"
              ? "bg-red-600 text-white"
              : "bg-gray-200 text-gray-700"
          } px-4 py-2 rounded-lg transition-all`}
        >
          No Stock
        </button>
      </div>

      {/* Conditional Rendering Based on Selected Filter */}
      {selectedFilter === "lowStock" && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-yellow-600 mb-4">
            Low Stock Items
          </h3>
          {lowStockItems.length > 0 ? (
            <ul className="space-y-3">
              {lowStockItems.map((item) => (
                <li
                  key={item.id}
                  className="flex justify-between items-center p-3 border border-gray-200 rounded-lg"
                >
                  <span className="text-gray-700">{item.name}</span>
                  <span className="text-red-600 font-semibold">
                    Qty: {item.quantity}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No low stock items.</p>
          )}
        </div>
      )}

      {selectedFilter === "noStock" && (
        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
          <h3 className="text-xl font-semibold text-red-600 mb-4">
            No Stock Items
          </h3>
          {noStockItems.length > 0 ? (
            <ul className="space-y-3">
              {noStockItems.map((item) => (
                <li
                  key={item.id}
                  className="flex justify-between items-center p-3 border border-gray-200 rounded-lg"
                >
                  <span className="text-gray-700">{item.name}</span>
                  <span className="text-gray-500">Out of Stock</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">All items are in stock.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Stock;
