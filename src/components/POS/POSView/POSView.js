import React, { useEffect, useRef, useState } from "react";
import POSViewHome from "./POSViewHome";
import { Link, useParams } from "react-router-dom";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useSelector } from "react-redux";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase";

function POSView() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("POS");
  const [POS, setPOS] = useState({});
  const userDetails = useSelector((state) => state.users);

  const companyId =
    userDetails.companies[userDetails.selectedCompanyIndex].companyId;

  const fetchPOS = async () => {
    try {
      const POSRef = doc(db, "companies", companyId, "pos", id);
      const resData = await getDoc(POSRef);
      const POSData = {
        id: resData.id,
        ...resData.data(),
      };
      setPOS(POSData);
    } catch (error) {
      console.error("Error fetching POS:", error);
    }
  };
  useEffect(() => {
    fetchPOS();
  }, [companyId]);

  return (
    <div className="px-5 pb-5 bg-gray-100" style={{ width: "100%" }}>
      <header className="flex items-center space-x-3 my-2 ">
        <Link
          className="flex items-center bg-gray-300 text-gray-700 py-1 px-4 rounded-full transform hover:bg-gray-400 hover:text-white transition duration-200 ease-in-out"
          to={"./../"}
        >
          <AiOutlineArrowLeft className="w-5 h-5 mr-2" />
        </Link>
        <h1 className="text-2xl font-bold">{POS.POSNo}</h1>
      </header>
      <hr />
      <div>
        {/* <nav className="flex space-x-4 mt-3 mb-3">
          <button
            className={
              "px-4 py-1" +
              (activeTab === "POS"
                ? " bg-blue-700 text-white rounded-full"
                : "")
            }
            onClick={() => setActiveTab("POS")}
          >
            POS View
          </button>
          <button
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
        </nav> */}
      </div>
      <hr />
      <div className="w-full">
        {activeTab === "POS" && (
          <div>
           <POSViewHome POS={POS} />
          </div>
        )}
        {/* {activeTab === "Returns" && (
          <div>
            <Returns />
          </div>
        )} */}
      </div>
    </div>
  );
}

export default POSView;
