import React from "react";
import { useEffect, useState } from "react";

import './Perfil.css'

export default function Perfil() {

  const [user, setUser] = useState('');
  const [endereco, setEndereco] = useState('');

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      alert("você já não está logado");
      window.location.href = "/";
    }
    getUser();
  }, []);

  const getUser = async () => {
    try {
      let response = await fetch("http://localhost:8080/perfil", {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      })
      let data = await response.json();
      if (response.status === 200) {
        setUser(data.conta);
        setEndereco(data.endereco);
      }
    } catch(e) {
      alert("erro no fetch: " + e);
    }
  }

  const showUserContent = () => {
    if (!user || !endereco) {
      return <p>Carregando...</p>
    } else {
      return(
        <>
          <p><strong>Nome:</strong> {user.nome}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>CPF:</strong> {user.cpf}</p>
          <p><strong>Telefone:</strong> {user.telefone}</p>
          <p><strong>Endereço:</strong> {endereco.endereco}, {endereco.numero} {endereco.complemento && `- ${endereco.complemento}`}</p>
          <p><strong>Bairro:</strong> {endereco.bairro}</p>
          <p><strong>Cidade:</strong> {endereco.cidade}</p>
          <p><strong>Estado:</strong> {endereco.estado}</p>
          <p><strong>CEP:</strong> {endereco.cep}</p>
        </>
        );
    }
  }

  return(
    <div className="homePage">
      <h1 className="title">Perfil</h1>
      {showUserContent()}
    </div>
  )
}