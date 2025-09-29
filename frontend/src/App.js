import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";
import Header from "./components/Header/Header.js";
import HomePage from "./pages/HomePage/HomePage.js";
import Register from "./pages/Register/Register.js";

export default function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/*<Route path="/login" element={<Login />} />*/}
        <Route path="/login/register" element={<Register />} />
      </Routes>
    </Router>
  );
}
