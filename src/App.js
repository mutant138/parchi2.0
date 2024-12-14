import "./App.css";
import Home from "./components/HomePage/Home";
import React from "react";
import LandingPage from "./components/LandingPage/LandingPage";
import { Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import VendorPO from "./components/VendorDashBoard/VendorPO";

function App() {
  const isAuthenticated = useSelector((state) => state.users.isLogin);
  const userDetails = useSelector((state) => state.users);
  const selectedDashboardUser = userDetails.selectedDashboard;

  return (
    <div>
      <Routes>
        <Route
          path="/*"
          element={isAuthenticated ? <Home /> : <LandingPage />}
        ></Route>
        {isAuthenticated && selectedDashboardUser === "vendor" && (
          <Route path="/vendor" element={<VendorPO />}></Route>
        )}
      </Routes>
    </div>
  );
}

export default App;
