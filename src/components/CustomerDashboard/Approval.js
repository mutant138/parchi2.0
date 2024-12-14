import React, { useEffect, useState } from "react";
import { db } from "../../firebase"; // Ensure Firebase is configured correctly
import { collection, getDocs, query, where } from "firebase/firestore";
import { Link, useParams } from "react-router-dom";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useSelector } from "react-redux";

const Approval = () => {
  const { id } = useParams();
  const projectId = id;
  const [approvals, setApprovals] = useState([]);
  const userDetails = useSelector((state) => state.users);

  const fetchApprovals = async () => {
    const approvalsRef = collection(db, `projects/${projectId}/approvals`);
    const q = query(
      approvalsRef,
      where("phoneNumber", "==", userDetails.phone)
    );

    const snapshot = await getDocs(q);

    const approvalsData = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setApprovals(approvalsData);
  };
  useEffect(() => {
    fetchApprovals();
  }, [projectId]);

  return (
    <div className="p-4">
      <div className="flex space-x-3 mb-4">
        <Link
          className="flex items-center bg-gray-300 text-gray-700 py-1 px-4 rounded-full transform hover:bg-gray-400 hover:text-white transition duration-200 ease-in-out"
          to={"./../"}
        >
          <AiOutlineArrowLeft className="w-5 h-5 mr-2" />
        </Link>
        <h1 className="text-xl font-bold">Approvals</h1>
      </div>
      <div className="space-y-4">
        {approvals.map((approval) => (
          <ApprovalCard key={approval.id} approval={approval} />
        ))}
      </div>
    </div>
  );
};

const ApprovalCard = ({ approval, isSideBarOpen }) => {
  return (
    <div className="bg-white p-4 rounded shadow flex justify-between items-center">
      <div className="flex items-center">
        <img
          src={approval.imageUrl || "https://via.placeholder.com/50"}
          alt={approval.name}
          className="w-12 h-12 rounded-full mr-4"
        />
        <div>
          <h2 className="text-lg font-semibold">{approval.name}</h2>
          <p className="text-gray-500 text-sm">
            Approver: {approval.approvalBelongsTo}
          </p>
          <p
            className={`text-sm ${
              approval.status === "Pending"
                ? "text-yellow-500"
                : "text-green-500"
            }`}
          >
            Status: {approval.status}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Approval;
