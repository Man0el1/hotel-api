import React, { useEffect, useState } from "react";

import './Login.css'

export default function Login() {

  const estados = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO']

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setTitle] = useState('');
  const [phone, setPhone] = useState('');
  const [cep, setCep] = useState('');
  const [endereco, setEndereco] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');

  const displayOptions = () => {
    return estados.map((uf, index) => (
      <option key={uf} value={uf}>{uf}</option>
    ));
  }

  useEffect(() => {
  }, []);

  return(
    <div className="loginPage">
      <form className='form-email' onSubmit={sendEmail}>
        <label htmlFor="name">Nome</label>
        <input onChange={(e) => setName(e.target.value)} maxLength='61' id='name' name='name' autoComplete="on" className='input' type='text' />
        
        <label htmlFor="email">Email</label>
        <input onChange={(e) => setEmail(e.target.value)} maxLength='61' id='email' name='email' autoComplete="on" className='input' type='email' />
        
        <label htmlFor="cpf">Cpf</label>
        <input onChange={(e) => setTitle(e.target.value)} maxLength='61' id='cpf' name='cpf' className='input' type='text' />
        
        <label htmlFor="phone">Telefone</label>
        <input onChange={(e) => setPhone(e.target.value)} maxLength='12' id='phone' name='phone' className='input' type='tel' />


        <label htmlFor="cep">Cpf</label>
        <input onChange={(e) => setCep(e.target.value)} maxLength='0' id='cep' name='cep' className='input' type='text' />
        
        <label htmlFor="endereco">Endereco</label>
        <input onChange={(e) => setEndereco(e.target.value)} maxLength='0' id='endereco' name='endereco' className='input' type='text' />
        
        <label htmlFor="numero">Numero</label>
        <input onChange={(e) => setNumero(e.target.value)} maxLength='0' id='numero' name='numero' className='input' type='text' />
        
        <label htmlFor="complemento">Complemento</label>
        <input onChange={(e) => setComplemento(e.target.value)} maxLength='0' id='complemento' name='complemento' className='input' type='text' />
        
        <label htmlFor="bairro">Bairro</label>
        <input onChange={(e) => setBairro(e.target.value)} maxLength='0' id='bairro' name='bairro' className='input' type='text' />
        
        <label htmlFor="cidade">Cidade</label>
        <input onChange={(e) => setCidade(e.target.value)} maxLength='0' id='cidade' name='cidade' className='input' type='text' />
        
        <label htmlFor="estado">Estado</label>
        <select onChange={(e) => setEstado(e.target.value)} id='estado' name='estado' className='input' type='text'>
          {displayOptions()}
        </select>
        <input className='submit' type='submit'/>
      </form>
    </div>
  )
}