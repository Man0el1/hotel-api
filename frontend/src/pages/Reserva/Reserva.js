import React, { useState, useEffect} from "react";
import './Reserva.css'

export default function Login() {

  const [dataAtual, setDataAtual] = useState('');
  const [dataAmanha, setDataAmanha] = useState('');
  const [checkin, setCheckin] = useState('');
  const [checkout, setCheckout] = useState('');
  const [quantPessoas, setQuantPessoas] = useState('');
  const [quantQuartos, setQuantQuartos] = useState('');

  useEffect(() => {
    getCurrentDate();
  }, []);

  useEffect(() => {
    if (!checkin) return;
    const amanha = new Date(checkin);
    amanha.setDate(amanha.getDate() + 1);
    setDataAmanha(amanha.toISOString().split('T')[0]);
  }, [checkin]);


  const getCurrentDate = async () => {
    try {
      let response = await fetch("http://localhost:8080/dataAtual", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      });
      let data = await response.json();
      if (response.status === 200) {
        setDataAtual(data.dataAtual);
      } else {
        setDataAtual(new Date().toISOString().split('T')[0]);
      }
    } catch (e) {
      setDataAtual(new Date().toISOString().split('T')[0]);
    };
  }

  /*const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response = await fetch("http://localhost:8080/login/entry", {
        method: "POST",
        headers: {'Content-Type': 'application/json'}, // indica que estamos enviando json
        body: JSON.stringify({email, senha})
      });
      let data = await response.json();
      if (response.status === 200) {
        localStorage.setItem("token", data.token); 
        alert(data.message);
        window.location.href = "/";
      } else {
        alert(data.message);
      }
    } catch (e) {
      console.log("erro no fetch");
    }
  }*/

  return(
    <div className="reservaPage">
      <form className='form-search' /*onSubmit={handleSubmit}*/>
        
        <label htmlFor="checkin">Check-in</label>
        <input value={checkin} onChange={(e) => setCheckin(e.target.value)} min={dataAtual} id='checkin' name='checkin' className='input' type='date' />

        <label htmlFor="checkout">Check-out</label>
        <input value={checkout} onChange={(e) => setCheckout(e.target.value)} min={dataAmanha} id='checkout' name='checkout' className='input' type='date' />

        <label htmlFor="quantPessoas">Pessoas</label>
        <input value={quantPessoas} onChange={(e) => setQuantPessoas(e.target.value)} min="1" max="20" id='quantPessoas' name='quantPessoas' className='input' type='number' />

        <label htmlFor="quantQuartos">Quartos</label>
        <input value={quantQuartos} onChange={(e) => setQuantQuartos(e.target.value)} min="1" max="20" id='quantQuartos' name='quantQuartos' className='input' type='number' />
        
        <input className='submit' type='submit' value='Enviar' />
      </form>
      <div>
        Data Atual: {dataAtual} <br />
        Data Amanhã: {dataAmanha} <br />
        Check-in: {checkin} <br />
        Check-out: {checkout} <br />
        Quantidade de Pessoas: {quantPessoas} <br />
        Quantidade de Quartos: {quantQuartos} <br />
      </div>
    </div>
  ) 
}