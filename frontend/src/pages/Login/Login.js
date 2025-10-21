import React, { useState } from "react";

import './Login.css'


export default function Login() {

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {'Content-Type': 'application/json'}, // indica que estamos enviando json
        body: JSON.stringify({email, senha})
      });
      let data = await response.json();
      if (response.status === 200) {
        alert(response.message);
      } else {
        alert(data.message);
      }
    } catch (e) {
      console.log("erro no fetch");
    }
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

      <a className="nav-link" href="/login/register">Sign-in</a>
    </div>
  ) 
}