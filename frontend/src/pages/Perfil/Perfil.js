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

  const handleCancelation = async (idReserva) => {
    try {
      let response = await fetch("http://localhost:8080/cancelar-reserva/", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify({idReserva})
      })
      let data = await response.json();
      if (response.status === 200) {
        alert(data.message);
        window.location.reload();
      }
    } catch(e) {
      alert("erro no fetch: " + e);
    }
  }

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
        <p><strong>Endereço:</strong> {endereco.endereco}, {endereco.numero} 
        {endereco.complemento && `- ${endereco.complemento}`}</p>
        <p><strong>Bairro:</strong> {endereco.bairro}</p>
        <p><strong>Cidade:</strong> {endereco.cidade}</p>
        <p><strong>Estado:</strong> {endereco.estado}</p>
        <p><strong>CEP:</strong> {endereco.cep}</p>
      </>
    );
  }

  const showUserBookings = () => {
    return(
      [...reservas].reverse().map(reserva => (
        <div key={reserva.id_reserva} className="bookingCard">
          <p><strong>Data de entrada:</strong> {new Date(reserva.check_in).toLocaleDateString('pt-BR')}</p>
          <p><strong>Data de saída:</strong> {new Date(reserva.check_out).toLocaleDateString('pt-BR')}</p>
          <p><strong>Valor total:</strong> R$ {reserva.valor_total}</p>
          <p><strong>Status:</strong> {reserva.status}</p>

          {reserva.status === "pendente" && <a 
            className="p-3 mb-2 bg-success text-white" 
            href={"http://localhost:3000/confirmar-reserva/" + reserva.id_reserva}>Confirmar reserva
          </a>}
          {reserva.status === "confirmada" && <button 
            className="p-3 mb-2 bg-danger text-white" 
            onClick={handleCancelation(reserva.id_reserva)}>Cancelar reserva
          </button>}
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