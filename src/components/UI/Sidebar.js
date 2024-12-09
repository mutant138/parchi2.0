import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { GrMenu } from "react-icons/gr";
// import { LiaMoneyBillWaveSolid } from "react-icons/lia";
// import { GrUserManager } from "react-icons/gr";
// import { CgMoreVerticalO } from "react-icons/cg";
import { FaAngleUp } from "react-icons/fa6";
import { FaAngleDown } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";

function SideBar() {
  const location = useLocation();
  const [isSideBarExpend, setIsSideBarExpend] = useState(true);

  const [sideBarDetails, setSideBarDetails] = useState({
    sales: {
      // image: <LiaMoneyBillWaveSolid size={30} />,
      isExpend: true,
      items: [
        // {
        //   name: "Expense",
        //   path: "/expense",
        // },
        {
          name: "Invoice",
          path: "/invoiceList",
        },
        {
          name: "Services",
          path: "/services",
        },
        // {
        //   name: "Quotation",
        //   path: "/quotation",
        // },
        // {
        //   name: "Pro Forma Invoice",
        //   path: "/pro-forma-invoice",
        // },
        // {
        //   name: "PO",
        //   path: "/po",
        // },
        // {
        //   name: "Delivery Challan",
        //   path: "",
        // },
        // {
        //   name: "Credit Note",
        //   path: "",
        // },
        // {
        //   name: "POS",
        //   path: "/pos",
        // },
      ],
    },
    manage: {
      // image: <GrUserManager size={30} />,
      isExpend: true,
      items: [
        {
          name: "Project",
          path: "/projects",
        },
        {
          name: "Products",
          path: "/products",
        },
        {
          name: "Services List",
          path: "/services-list",
        },
        {
          name: "Staff & Payout",
          path: "/staff-payout",
        },
        {
          name: "Customers",
          path: "/customer",
        },
        {
          name: "Vendors",
          path: "/vendor",
        },
        // {
        //   name: "Documents",
        //   path: "",
        // },
        // {
        //   name: "Reminder",
        //   path: "/reminder",
        // },
      ],
    },
    // more: {
    //   // image: <CgMoreVerticalO size={30} />,
    //   isExpend: true,
    //   items: [
    //     {
    //       name: "Insights",
    //       path: "",
    //     },
    //     {
    //       name: "Report",
    //       path: "",
    //     },
    //     {
    //       name: "Business Card",
    //       path: "",
    //     },
    //   ],
    // },
  });

  return (
    <div
      className="border-2 h-full overflow-y-auto"
      style={{ width: isSideBarExpend ? "15vw" : "" }}
    >
      <div className="flex justify-end cursor-pointer">
        <div
          className=""
          onClick={() => {
            setIsSideBarExpend(!isSideBarExpend);
            setSideBarDetails({
              sales: {
                ...sideBarDetails.sales,
                isExpend: false,
              },
              manage: {
                ...sideBarDetails.manage,
                isExpend: false,
              },
              more: {
                ...sideBarDetails.more,
                isExpend: false,
              },
            });
          }}
        >
          {isSideBarExpend ? <IoMdClose size={30} /> : <GrMenu size={30} />}
        </div>
      </div>
      <div className="p-1">
        <div className=" border-b-2">
          <div
            className="flex items-center justify-between"
            onClick={() =>
              setSideBarDetails({
                ...sideBarDetails,
                sales: {
                  ...sideBarDetails.sales,
                  isExpend: !sideBarDetails.sales.isExpend,
                },
              })
            }
          >
            <div className="flex items-center">
              {/* <div>{sideBarDetails.sales.image}</div> */}
              <div
                className="text-lg font-semibold pl-3"
                hidden={!isSideBarExpend}
              >
                Sales
              </div>
            </div>
            <div hidden={!isSideBarExpend}>
              {sideBarDetails.sales.isExpend ? <FaAngleUp /> : <FaAngleDown />}
            </div>
          </div>
          <div
            className={
              isSideBarExpend ? "" : "ml-2 mt-2 bg-white rounded-lg shadow-lg"
            }
          >
            {sideBarDetails.sales.isExpend &&
              sideBarDetails.sales.items.map((item, index) => (
                <Link key={index} to={item.path} className=" cursor-pointer">
                  <div
                    className={
                      "w-full py-2 px-3 border-t hover:bg-gray-300 hover:rounded-lg  " +
                      (location.pathname
                        .split("/")
                        .includes(item.path.split("/")[1])
                        ? "bg-gray-300 rounded-lg"
                        : "")
                    }
                  >
                    {item.name}
                  </div>
                </Link>
              ))}
          </div>
        </div>

        <div className="mt-3  border-b-2">
          <div
            className="flex items-center justify-between"
            onClick={() =>
              setSideBarDetails({
                ...sideBarDetails,
                manage: {
                  ...sideBarDetails.manage,
                  isExpend: !sideBarDetails.manage.isExpend,
                },
              })
            }
          >
            <div className="flex items-center">
              {/* <div>{sideBarDetails.manage.image}</div> */}
              <div
                className="text-lg font-semibold pl-3"
                hidden={!isSideBarExpend}
              >
                Manage
              </div>
            </div>
            <div hidden={!isSideBarExpend}>
              {sideBarDetails.manage.isExpend ? <FaAngleUp /> : <FaAngleDown />}
            </div>
          </div>
          <div
            className={
              "" +
              (isSideBarExpend
                ? ""
                : "absolute left-full ml-2 mt-2 bg-white rounded-lg shadow-lg")
            }
          >
            {sideBarDetails.manage.isExpend &&
              sideBarDetails.manage.items.map((item, index) => (
                <Link key={index} to={item.path} className=" cursor-pointer">
                  <div
                    className={
                      "w-full py-2 px-3 border-t hover:bg-gray-300 hover:rounded-lg  " +
                      (location.pathname
                        .split("/")
                        .includes(item.path.split("/")[1])
                        ? "bg-gray-300 rounded-lg"
                        : "")
                    }
                  >
                    {item.name}
                  </div>
                </Link>
              ))}
          </div>
        </div>

        {/* <div className="mt-3  border-b-2 mb-10">
          <div
            className="flex items-center justify-between"
            onClick={() =>
              setSideBarDetails({
                ...sideBarDetails,
                more: {
                  ...sideBarDetails.more,
                  isExpend: !sideBarDetails.more.isExpend,
                },
              })
            }
          >
            <div className="flex items-center ">
              <div
                className="text-lg font-semibold pl-3 "
                hidden={!isSideBarExpend}
              >
                More
              </div>
            </div>
            <div hidden={!isSideBarExpend}>
              {sideBarDetails.more.isExpend ? <FaAngleUp /> : <FaAngleDown />}
            </div>
          </div>
          <div
            className={
              isSideBarExpend ? "" : "ml-2 mt-2 bg-white rounded-lg shadow-lg"
            }
          >
            {sideBarDetails.more.isExpend &&
              sideBarDetails.more.items.map((item, index) => (
                <Link key={index} to={item.path} className=" cursor-pointer">
                  <div
                    className={
                      "w-full py-2 px-3 border-t hover:bg-gray-300 hover:rounded-lg  " +
                      (location.pathname
                        .split("/")
                        .includes(item.path.split("/")[1])
                        ? "bg-gray-300 rounded-lg"
                        : "")
                    }
                  >
                    {item.name}
                  </div>
                </Link>
              ))}
          </div>
        </div> */}
      </div>
    </div>
  );
}

export default SideBar;
