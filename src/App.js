import "./App.css";
import Home from "./components/HomePage/Home";
import React from "react";
import LandingPage from "./components/LandingPage/LandingPage";
import { Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";

function App() {
  const isAuthenticated = useSelector((state) => state.users.isLogin);
  return (
    <div>
      <Routes>
        <Route
          path="/*"
          element={isAuthenticated ? <Home /> : <LandingPage />}
        ></Route>
      </Routes>
    </div>
  );
}

export default App;
