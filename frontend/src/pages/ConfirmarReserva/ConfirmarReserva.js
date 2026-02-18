import React, {useEffect, useState } from "react";
import { useParams} from "react-router-dom";

import './ConfirmarReserva.css'

export default function ConfirmarReserva() {
  const params = useParams();

  const [bookingInfo, setBookingInfo] = useState(null);

  useEffect(() => {
    showBookingInfo();
  }, []);

  const showUserContent = (reserva) => {
    if (!reserva) return <p>Carregando...</p>;
    const tiposDeQuarto = [
      { tipo: 'SOLTEIRO', total: 0, fumante: 0, frente: 0 },
      { tipo: 'CASAL', total: 0, fumante: 0, frente: 0 },
      { tipo: 'FAMILIA', total: 0, fumante: 0, frente: 0 },
      { tipo: 'LUXO', total: 0, fumante: 0, frente: 0 }
    ];

    reserva.Quartos.forEach(quarto => {
      const tipo = tiposDeQuarto.find(t => t.tipo === quarto.tipo);
      if (!tipo) return;
      
      tipo.total++;
      if (quarto.is_smoker) tipo.fumante++;
      if (quarto.is_front_view) tipo.frente++;
    });

    return (
      tiposDeQuarto.map((tipo, index) => (
        <div key={index}>
          {tipo.total > 0} && <h3>x quarto de {tipo.tipo}</h3>
          {tipo.fumante > 0 && <p>{tipo.fumante}x fumante</p>}
          {tipo.frente > 0 && <p>{tipo.frente}x frente</p>}
        </div>
      ))
    );
  }

  const showBookingInfo = async () => {
    try {
      let response = await fetch("http://localhost:8080/confirmar-reserva/" + params.idReserva, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      });
      let data = await response.json();
      console.log(data.reserva);
      if (response.status === 200) {
       setBookingInfo(showUserContent(data.reserva));
      } else {
        alert(data.message);
        window.location.href = "http://localhost:3000/404";
      }
    } catch (e) {
      console.log("erro no fetch" + e);
    }
  }

  const handleSubmit = async (e) => {
    try {
      let response = await fetch("http://localhost:8080/confirmar-reserva/" + params.idReserva, + "/submit", {
        method: "post",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body:
      });
      let data = await response.json();
      if (response.status === 200) {
        alert("Reserva confirmada com sucesso!");
        window.location.href = "http://localhost:3000/perfil/";
      } else {
        alert(data.message);
      }
    } catch (e) {
      console.log("erro no fetch");
    }
  }

  return(
    <div className="confirm-page">
      <h1>Confirme sua reserva:</h1>
      <div>{bookingInfo}</div>
      <button className="btn btn-primary" onClick={handleSubmit}>Confirmar</button>
    </div>
  ) 
}