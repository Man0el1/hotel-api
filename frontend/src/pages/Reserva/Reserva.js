import React, { useState, useEffect} from "react";
import './Reserva.css'
import QuartoModal from "../../components/Modal/Modal";

export default function Reserva() {

  const [dataAtual, setDataAtual] = useState('');
  const [totalDias, setTotalDias] = useState(0);
  const [precoTotal, setPrecoTotal] = useState(0);
  const [dataCheckInAmanha, setDataCheckInAmanha] = useState('');
  const [dataAnoSeguinte, setDataAnoSeguinte] = useState('');
  const [checkin, setCheckin] = useState('');
  const [checkout, setCheckout] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true); 
  const [showModal, setShowModal] = useState(false);
  const [modalQuartoSelecionado, setModalQuartoSelecionado] = useState(null);
  const [modalTipoSelecionado, setModalTipoSelecionado] = useState(null);
  const [quantMaxQuartos, setQuantMaxQuartos] = useState(({SOLTEIRO: 0, CASAL: 0, FAMILIA: 0, LUXO: 0}));
  const [quantMaxQuartosFumante, setQuantMaxQuartosFumante] = useState(({SOLTEIRO: 0, CASAL: 0, FAMILIA: 0, LUXO: 0}));
  const [quantMaxQuartosFrente, setQuantMaxQuartosFrente] = useState(({SOLTEIRO: 0, CASAL: 0, FAMILIA: 0, LUXO: 0}));

  const [tiposDeQuarto, setTiposDeQuarto] = useState([
    { tipo: 'SOLTEIRO', capacidade: 1, preco: 120, contador: 0, contadorFumante: 0, contadorFrente: 0 },
    { tipo: 'CASAL', capacidade: 2, preco: 200, contador: 0, contadorFumante: 0, contadorFrente: 0 },
    { tipo: 'FAMILIA', capacidade: 4, preco: 350, contador: 0, contadorFumante: 0, contadorFrente: 0 },
    { tipo: 'LUXO', capacidade: 2, preco: 550, contador: 0, contadorFumante: 0, contadorFrente: 0 }
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
      soma += quarto.preco * quarto.contador + quarto.contadorFrente * (0.1 * quarto.preco)
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

  const alterarContador = (tipo, valor, tipoContador) => {
    setTiposDeQuarto(prev =>
      prev.map(quarto => {
        if (quarto.tipo !== tipo) return quarto;

        if (tipoContador === 'normal') {
          const novoValor = quarto.contador + valor;
          if (novoValor > quantMaxQuartos[tipo] || novoValor < 0) return quarto;

          let fumante = quarto.contadorFumante;
          let frente = quarto.contadorFrente;
          while (fumante + frente > novoValor) {
            if (frente > 0) frente--;
            else fumante--;
          }

          return {
            ...quarto,
            contador: novoValor,
            contadorFumante: fumante,
            contadorFrente: frente
          };
        }

        if (tipoContador === 'fumante') {
          const novoValor = quarto.contadorFumante + valor;
          const maxExtras = novoValor + quarto.contadorFrente;
          if (novoValor > quantMaxQuartosFumante[tipo] || novoValor < 0 || novoValor + quarto.contadorFrente > quarto.contador) return quarto;

          return {
            ...quarto,
            contadorFumante: Math.min(maxExtras, novoValor)
          }
        }

        if (tipoContador === 'frente') {
          const novoValor = quarto.contadorFrente + valor;
          const maxExtras = quarto.contadorFumante + novoValor;
          if (novoValor > quantMaxQuartosFrente[tipo] || novoValor < 0 || novoValor + quarto.contadorFumante > quarto.contador) return quarto;

          return {
            ...quarto, 
            contadorFrente: Math.min(maxExtras, novoValor)
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
            <button onClick={() => {alterarContador(quarto.tipo, -1, 'normal')}} className="posneg" disabled={isButtonDisabled}>-</button>
            <span className="numero-quartos">{quarto.contador}</span>
            <button onClick={() => {alterarContador(quarto.tipo, 1, 'normal')}} className="posneg" disabled={isButtonDisabled}>+</button>
          </div>
          <button onClick={() => {setModalTipoSelecionado(quarto.tipo); setShowModal(true)}} disabled={isButtonDisabled}>opções extras</button>
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
        setQuantMaxQuartosFumante(data.disponibilidadeFumante)
        setQuantMaxQuartosFrente(data.disponibilidadeFrente)
        setIsButtonDisabled(false);
        setPrecoTotal(0);

        tiposDeQuarto.forEach(quarto => {
          quarto.contador = 0;
        });

      } else {
        alert(data.message);
      }
    } catch (e) {
      console.log("erro no fetch");
    }
  }

  const quartoSelecionado = tiposDeQuarto.find(
    q => q.tipo === modalTipoSelecionado
  ); // para passar o quarto selecionado para o modal 

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

      <button onClick={() => {submitBooking()}}>Enviar</button>

      <QuartoModal
        show={showModal}
        onHide={() => setShowModal(false)}
        tipo={modalTipoSelecionado}
        quarto={quartoSelecionado}
        setQuantMaxQuartosFumante={setQuantMaxQuartosFumante}
        setQuantMaxQuartosFrente={setQuantMaxQuartosFrente}
        quantMaxQuartosFumante={quantMaxQuartosFumante}
        quantMaxQuartosFrente={quantMaxQuartosFrente}
        setTiposDeQuarto={setTiposDeQuarto}
        alterarContador={alterarContador}
      />
    </div>
  ) 
}