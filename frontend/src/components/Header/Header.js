import React from "react";

import './Header.css'

export default function Header() {
  return(
    <div className="header">
      <ul className="navbar">
        { localStorage.getItem('token') ? (
          <>
            <li className="nav-item">
              <a className="nav-link" href="/reserva">reserva</a>
            </li>
            <li className="nav-item">
              <p className="nav-link" >perfil</p>
            </li>
          </>
        ) : (
          <>
            <li className="nav-item">
              <a className="nav-link" href="/login">login</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/login/register">registrar</a>
            </li>
          </>
        )}
      </ul>
    </div>
  )
}