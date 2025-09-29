import React, { useEffect, useState } from "react";

import './Register.css'

export default function Register() {

  const estados = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO']

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [cpf, setCpf] = useState('');
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

  const handleCepChange = (e) => { setCep(e.target.value.replace(/\D/g, "")); }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response = await fetch("http://localhost:8080/login/register/create", {
        method: "POST",
        headers: {'Content-Type': 'application/json'}, // indica que estamos enviando json
        body: JSON.stringify({name, email, senha, cpf, phone, cep, endereco, numero, complemento, bairro, cidade, estado})
      });
      let data = await response.json();
      if (response.status === 200) {
        alert("Conta criada com sucesso! Agora você pode fazer login.");
      } else {
        alert(data.message);
      }
    } catch (e) {
      console.log("erro no fetch: " + e);
    }
  }

  useEffect(() => {
    const fetchCep = async () => {
      if(cep.length === 8){
        try {
          let response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
          let data = await response.json();

          if(!data.erro) {
            setComplemento(data.complemento);
            setBairro(data.bairro);
            setCidade(data.localidade);
            setEstado(data.uf);
          } else {
            console.log('cep não existe');
          }
        } catch (e) {
          console.log('fetch deu erro!');
        }
      }
    }
    fetchCep();
  }, [cep]);

  return(
    <div className="registerPage">
      <form className='form-email' onSubmit={handleSubmit}>
        <label htmlFor="name">Nome</label>
        <input value={name} onChange={(e) => setName(e.target.value)} maxLength='61' id='name' name='name' className='input' type='text' />
        
        <label htmlFor="email">Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} maxLength='61' id='email' name='email' className='input' type='email' />

        <label htmlFor="senha">Senha</label>
        <input value={senha} onChange={(e) => setSenha(e.target.value)} minLength='8' id='senha' name='senha' className='input' type='password' />
        
        <label htmlFor="cpf">Cpf</label>
        <input value={cpf} onChange={(e) => setCpf(e.target.value)} maxLength='61' id='cpf' name='cpf' className='input' type='text' />
        
        <label htmlFor="phone">Telefone</label>
        <input value={phone} onChange={(e) => setPhone(e.target.value)} maxLength='12' id='phone' name='phone' className='input' type='tel' />


        <label htmlFor="cep">Cep</label>
        <input value={cep} onChange={(e) => handleCepChange(e)} maxLength='8' id='cep' name='cep' className='input' type='text' />
        
        <label htmlFor="endereco">Endereco</label>
        <input value={endereco} onChange={(e) => setEndereco(e.target.value)} maxLength='100' id='endereco' name='endereco' className='input' type='text' />
        
        <label htmlFor="numero">Numero</label>
        <input value={numero} onChange={(e) => setNumero(e.target.value)} maxLength='15' id='numero' name='numero' className='input' type='text' />
        
        <label htmlFor="complemento">Complemento</label>
        <input value={complemento} onChange={(e) => setComplemento(e.target.value)} maxLength='100' id='complemento' name='complemento' className='input' type='text' />
        
        <label htmlFor="bairro">Bairro</label>
        <input value={bairro} onChange={(e) => setBairro(e.target.value)} maxLength='30' id='bairro' name='bairro' className='input' type='text' />
        
        <label htmlFor="cidade">Cidade</label>
        <input value={cidade} onChange={(e) => setCidade(e.target.value)} maxLength='32' id='cidade' name='cidade' className='input' type='text' />
        
        <label htmlFor="estado">Estado</label>
        <select value={estado} onChange={(e) => setEstado(e.target.value)} id='estado' name='estado' className='input' type='text'>
          {displayOptions()}
        </select>
        <input className='submit' type='submit' value='Enviar' />
      </form>
    </div>
  ) 
}