import React, { useEffect, useRef, useState } from "react";
import Po from "./Po";
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


const PoView = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("PO");
  const [po, setPo] = useState({});
  const userDetails = useSelector((state) => state.users);
  const [bankDetails, setBankDetails] = useState({});
 

  const companyId =
    userDetails.companies[userDetails.selectedCompanyIndex].companyId;

  const fechPO = async () => {
    try {
      const poRef = doc(db, "companies", companyId, "po", id);
      const resData = (await getDoc(poRef)).data();
      const poData = {
        id,
        ...resData,
      };
      if (poData.book.bookRef) {
        const bankData = (await getDoc(poData.book.bookRef)).data();
        setBankDetails(bankData);
      }
      setPo(poData);
    } catch (error) {
      console.error("Error fetching po:", error);
    }
  };

  useEffect(() => {
    fechPO();
  }, [companyId]);

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
    <div className="px-5 pb-5 bg-gray-100" style={{ width: "100%" }}>
      <header className="flex items-center space-x-3 my-2 ">
        <Link
          className="flex items-center bg-gray-300 text-gray-700 py-1 px-4 rounded-full transform hover:bg-gray-400 hover:text-white transition duration-200 ease-in-out"
          to={"./../"}
        >
          <AiOutlineArrowLeft className="w-5 h-5 mr-2" />
        </Link>
        <h1 className="text-2xl font-bold">{po.poNo}</h1>
      </header>
      
      <hr />
      <div className="w-full">
        {activeTab === "PO" && (
          <div>
            <Po Po={po} bankDetails={bankDetails} />
          </div>
        )}
       
      </div>
    </div>
  );
}

export default PoView;
