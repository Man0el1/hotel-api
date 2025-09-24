import React from "react";

import './Header.css'

export default function Header() {
  return(
    <div className="header">
      <ul className="navbar">
        <li className="nav-item">
          <a className="nav-link" href="/reserva">reserva</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="/login">login</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="/sigma">sigma</a>
        </li>
      </ul>
    </div>
  )
}