import React, { useEffect, useState } from "react";
import DeliveryChallan from "./DeliveryChallan";
import { Link, useParams } from "react-router-dom";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useSelector } from "react-redux";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../../firebase";

const DeliveryChallanView = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("DeliveryChallan");
  const [deliveryChallan, setDeliveryChallan] = useState({});
  const userDetails = useSelector((state) => state.users);
  const [bankDetails, setBankDetails] = useState({});
  const [returnData, setReturnData] = useState([]);

  const companyId =
    userDetails.companies[userDetails.selectedCompanyIndex].companyId;

  const fetchDeliveryChallan = async () => {
    try {
      const deliveryChallanRef = doc(
        db,
        "companies",
        companyId,
        "deliverychallan",
        id
      );
      const resData = (await getDoc(deliveryChallanRef)).data();
      const deliveryChallanData = {
        id,
        ...resData,
      };
      setDeliveryChallan(deliveryChallanData);
    } catch (error) {
      console.error("Error fetching deliveryChallan:", error);
    }
  };

  //   async function fetchReturnData() {
  //     try {
  //       const returnsRef = collection(
  //         db,
  //         "companies",
  //         companyId,
  //         "deliveryChallan",
  //         id,
  //         "returns"
  //       );
  //       const q = query(returnsRef, orderBy("createdAt", "desc"));
  //       const getDataDocs = await getDocs(q);

  //       const getData = getDataDocs.docs.map((doc) => {
  //         const { createdAt, ...data } = doc.data();
  //         return {
  //           id: doc.id,
  //           ...data,
  //           createdAt: DateFormate(createdAt),
  //         };
  //       });
  //       setReturnData(getData);
  //     } catch (error) {
  //       console.log("🚀 ~ fetchReturnData ~ error:", error);
  //     }
  //   }

  //   useEffect(() => {
  //     fetchReturnData();
  //   }, [companyId]);

  useEffect(() => {
    fetchDeliveryChallan();
  }, [companyId]);

  //   function DateFormate(timestamp) {
  //     const milliseconds =
  //       timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000;
  //     const date = new Date(milliseconds);
  //     const getDate = String(date.getDate()).padStart(2, "0");
  //     const getMonth = String(date.getMonth() + 1).padStart(2, "0");
  //     const getFullYear = date.getFullYear();

  //     return `${getDate}/${getMonth}/${getFullYear}`;
  //   }
  console.log("deliveryChallan", deliveryChallan);
  return (
    <div className="px-5 pb-5 bg-gray-100" style={{ width: "100%" }}>
      <header className="flex items-center space-x-3 my-2 ">
        <Link
          className="flex items-center bg-gray-300 text-gray-700 py-1 px-4 rounded-full transform hover:bg-gray-400 hover:text-white transition duration-200 ease-in-out"
          to={"./../"}
        >
          <AiOutlineArrowLeft className="w-5 h-5 mr-2" />
        </Link>
        <h1 className="text-2xl font-bold">
          {deliveryChallan.deliveryChallanNo}
        </h1>
      </header>

      <div>
        <nav className="flex space-x-4 mt-3 mb-3">
          {/* <button
            className={
              "px-4 py-1" +
              (activeTab === "deliveryChallan"
                ? " bg-blue-700 text-white rounded-full"
                : "")
            }
            onClick={() => setActiveTab("deliveryChallan")}
          >
            deliveryChallan View
          </button> */}
          {/* <button
            className={
              "px-4 py-1" +
              (activeTab === "Returns"
                ? " bg-blue-700 text-white rounded-full"
                : "")
            }
            onClick={() => setActiveTab("Returns")}
          >
            Returns
          </button>
          <button
            className={
              "px-4 py-1" +
              (activeTab === "ReturnsHistory"
                ? " bg-blue-700 text-white rounded-full"
                : "")
            }
            onClick={() => setActiveTab("ReturnsHistory")}
          >
            ReturnsHistory
          </button> */}
        </nav>
      </div>
      <hr />
      <div className="w-full">
        {activeTab === "DeliveryChallan" && (
          <div>
            <DeliveryChallan deliveryChallan={deliveryChallan} />
          </div>
        )}
        {/* {activeTab === "Returns" && (
          <div>
            <Returns deliveryChallan={deliveryChallan} />
          </div>
        )}
        {activeTab === "ReturnsHistory" && (
          <div>
            <ReturnsHistory products={returnData} refresh={fetchReturnData} />
          </div>
        )} */}
      </div>
    </div>
  );
};

export default DeliveryChallanView;
