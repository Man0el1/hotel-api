import React from "react";

import './NotFound.css'

export default function NotFound() {
  return(
    <div className="homePage">
      <h1 className="title">404</h1>
      <h2 className="subtitle">Página não encontrada</h2>
      <a className="home-link" href="/">Voltar para a página inicial</a>
    </div>
  )
}