import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";

import Header from "./components/Header/Header.js";
import HomePage from "./pages/HomePage/HomePage.js";
import Login from "./pages/Login/Login.js"
import Register from "./pages/Register/Register.js";
import NotFound from "./pages/NotFound/NotFound.js";
import Perfil from "./pages/Perfil/Perfil.js";
import Reserva from "./pages/Reserva/Reserva.js";

export default function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/reserva" element={<Reserva />} />
      </Routes>
    </Router>
  );
}
