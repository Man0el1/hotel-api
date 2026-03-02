import React, {useEffect, useState } from "react";
import { useParams} from "react-router-dom";
import fetchProtected from "../../services/fetchProtected";

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
          {tipo.total > 0 && <h3>{tipo.total}x quarto de {tipo.tipo}</h3>}
          {tipo.fumante > 0 && <p>{tipo.fumante}x fumante</p>}
          {tipo.frente > 0 && <p>{tipo.frente}x frente</p>}
        </div>
      ))
    );
  }

  const showBookingInfo = async () => {
    try {
      let response = await fetchProtected("http://localhost:8080/confirmar-reserva/" + params.idReserva, {
        method: "GET"
      });
      let data = await response.json();
      if (!response.ok) {
        window.location.href = "http://localhost:3000/404";
        return;
      }

      setBookingInfo(showUserContent(data.reserva));

    } catch (e) {
      console.log("erro no fetch" + e);
    }
  }

  const handleSubmit = async (e) => {
    try {
      let response = await fetchProtected( "http://localhost:8080/confirmar-reserva/" + params.idReserva + "/submit", {
        method: "GET"
      });
      if (!response.ok) return;

      window.location.href = "http://localhost:3000/perfil/";

    } catch (e) {
      console.log("erro no fetch: " + e);
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