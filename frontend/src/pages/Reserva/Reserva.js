import React, { useState, useEffect} from "react";
import './Reserva.css'

export default function Login() {

  const [dataAtual, setDataAtual] = useState('');
  const [totalDias, setTotalDias] = useState(0);
  const [precoTotal, setPrecoTotal] = useState(0);
  const [dataCheckInAmanha, setDataCheckInAmanha] = useState('');
  const [dataAnoSeguinte, setDataAnoSeguinte] = useState('');
  const [checkin, setCheckin] = useState('');
  const [checkout, setCheckout] = useState('');
  const [isDisabled, setIsDisabled] = useState(true);
  const [quantMaxQuartos, setQuantMaxQuartos] = useState(({SOLTEIRO: 0, CASAL: 0, FAMILIA: 0, LUXO: 0}));

  const [tiposDeQuarto, setTiposDeQuarto] = useState([
    { tipo: 'SOLTEIRO', capacidade: 1, preco: 120, contador: 0 },
    { tipo: 'CASAL', capacidade: 2, preco: 200, contador: 0 },
    { tipo: 'FAMILIA', capacidade: 4, preco: 350, contador: 0 },
    { tipo: 'LUXO', capacidade: 2, preco: 550, contador: 0 }
  ]);

  useEffect(() => {
    getCurrentDate();
  }, []);

  useEffect(() => {
    if (!checkin) return;

    const amanha = new Date(checkin);
    amanha.setDate(amanha.getDate() + 1);
    setDataCheckInAmanha(amanha.toISOString().split('T')[0]);

    const dataCheckout = new Date(checkout);
    if (dataCheckout <= amanha) {
      setCheckout(amanha.toISOString().split('T')[0]);
    }
    setTotalDias((dataCheckout - new Date(checkin)) / (1000 * 60 * 60 * 24));
  }, [checkin, checkout]);

  useEffect(() => {
    calcularPrecoTotal();
  }, [tiposDeQuarto]);

  const calcularPrecoTotal = () => {
    let soma = 0;
    tiposDeQuarto.forEach(quarto => {
      soma += quarto.preco * quarto.contador;
    });
    setPrecoTotal(soma * totalDias);
  }

  const getCurrentDate = async () => {
    try {
      let response = await fetch("http://localhost:8080/dataAtual", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      });;
      let data = await response.json();
      if (response.status === 200) {
        setDataAtual(data.dataAtual);
        setDataAnoSeguinte(data.dataAnoSeguinte);
      } else {
        //lembrar de remover, indicar erro depois para so carregar se o servidor responder
        setDataAtual(new Date().toISOString().split('T')[0]);
      }
    } catch (e) {
      setDataAtual(new Date().toISOString().split('T')[0]);
    };
  }

  const alterarContador = (tipo, valor) => {
    setTiposDeQuarto(prev =>
      prev.map(quarto => {
        if (quarto.tipo === tipo) {
          const novoValor = quarto.contador + valor;
          if (novoValor <= quantMaxQuartos[tipo] && novoValor >= 0) {
            return {...quarto, contador: novoValor}
          }
        }
        return quarto;
      })
    );
  };

  const showQuartos = () => {
    return (
      tiposDeQuarto.map((quarto) => (
        <div key={quarto.tipo} className="quarto-card">
          <h3>Quarto de {quarto.tipo} </h3>
          <p>Capacidade: {quarto.capacidade} pessoa(s)</p>
          <p>Preço por noite: R$ {quarto.preco}</p>
          <div className="contador-quartos">
            <button onClick={() => {alterarContador(quarto.tipo, -1)}} disabled={isDisabled}>-</button>
            <span className="numero-quartos">{quarto.contador}</span>
            <button onClick={() => {alterarContador(quarto.tipo, 1)}} disabled={isDisabled}>+</button>
          </div>
        </div>
      ))
    );
  };

  const handleSubmitDays = async (e) => {
    e.preventDefault();
    try {
      let response = await fetch("http://localhost:8080/reserva/disponibilidade", {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({checkin, checkout})
      });
      let data = await response.json();
      if (response.status === 200) {
        setQuantMaxQuartos(data.disponibilidade)
        setIsDisabled(false);
        tiposDeQuarto.forEach(quarto => {
          quarto.contador = 0;
        });
        setPrecoTotal(0);
      } else {
        alert(data.message);
      }
    } catch (e) {
      console.log("erro no fetch");
    }
  }

  return(
    <div className="reserva-page">
      <div className="form-reserva">
        <form className='form-search' onSubmit={handleSubmitDays}>
          
          <label htmlFor="checkin">Check-in</label>
          <input value={checkin} onChange={(e) => setCheckin(e.target.value)} min={dataAtual} max={dataAnoSeguinte} id='checkin' name='checkin' className='input' type='date' />

          <label htmlFor="checkout">Check-out</label>
          <input value={checkout} onChange={(e) => setCheckout(e.target.value)} min={dataCheckInAmanha} max={dataAnoSeguinte} id='checkout' name='checkout' className='input' type='date' />
          
          <input className='submit' type='submit' value='Enviar' />
        </form>
      </div>

      <div className="">
        <div className="tipos-quartos">
          {showQuartos()}
        </div>
        <span> precoTotal: {precoTotal} </span>
      </div>
    </div>
  ) 
}