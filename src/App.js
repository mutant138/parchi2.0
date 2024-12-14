import "./App.css";
import Home from "./components/HomePage/Home";
import React from "react";
import LandingPage from "./components/LandingPage/LandingPage";
import { Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import CustomerHome from "./components/HomePage/CustomerHome";
import VendorHome from "./components/HomePage/VendorHome";

function App() {
  const usersDetails = useSelector((state) => state.users);
  const isAuthenticated = usersDetails.isLogin;
  return (
    <div>
      <Routes>
        {!isAuthenticated && <Route path="/" element={<LandingPage />}></Route>}
        {isAuthenticated && usersDetails.selectedDashboard === "" && (
          <Route path="/*" element={<Home />}></Route>
        )}
        {isAuthenticated && usersDetails.selectedDashboard === "customer" && (
          <Route path="/customer/*" element={<CustomerHome />}></Route>
        )}
        {isAuthenticated && usersDetails.selectedDashboard === "vendor" && (
          <Route path="/vendor/*" element={<VendorHome />}></Route>
        )}
      </Routes>
    </div>
  );
}

export default App;
