import React, { useState, useEffect} from "react";

import './ConfirmarReserva.css'

export default function ConfirmarReserva() {

  const [email, setEmail] = useState('');

  useEffect(() => {
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
  }

  return(
    <div className="loginPage">
      <form className='form-email' onSubmit={handleSubmit}>
        
        <label htmlFor="email">Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} maxLength='61' id='email' name='email' className='input' type='email' />

        <label htmlFor="senha">Senha</label>
        <input value={senha} onChange={(e) => setSenha(e.target.value)} minLength='8' id='senha' name='senha' className='input' type='password' />
        
        <input className='submit' type='submit' value='Enviar' />
      </form>

      <a className="nav-link" href="/register">Crie uma conta</a>
    </div>
  ) 
}