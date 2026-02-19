import React from "react";
import { useEffect, useState } from "react";

import './Perfil.css'

export default function Perfil() {

  const [user, setUser] = useState('');
  const [endereco, setEndereco] = useState('');
  const [reservas, setReservas] = useState('');

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      alert("você já não está logado");
      window.location.href = "/";
    }
    getUserInfo();
  }, []);

  const getUserInfo = async () => {
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
        setReservas(data.reservas);
      }
    } catch(e) {
      alert("erro no fetch: " + e);
    }
  }

  const showUserData = () => {
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

  const showUserBookings = () => {
    
    return(
      reservas.map(reserva => (
        <div key={reserva.id_reserva} className="bookingCard">
          <p><strong>ID da reserva:</strong> {reserva.id_reserva}</p>
          <p><strong>Data de entrada:</strong> {new Date(reserva.data_entrada).toLocaleDateString()}</p>
          <p><strong>Data de saída:</strong> {new Date(reserva.data_saida).toLocaleDateString()}</p>
          <p><strong>Valor total:</strong> R$ {reserva.valor_total}</p>
          <p><strong>Status:</strong> {reserva.status}</p>
        </div>
      ))
    );
  }

  const userContent = () => {
    if (!user || !endereco || !reservas) {
      return <p>Carregando...</p>
    } else {
      return(
        <div className="userInfo">
          <div className="userData">
            {showUserData()}
          </div>
          <div className="userBookings">
            {showUserBookings()}
          </div>
        </div>
      );
    }
  }

  return(
    <div className="homePage">
      <h1 className="title">Perfil</h1>
      {userContent()}
    </div>
  )
}