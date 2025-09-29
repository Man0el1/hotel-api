import { Conta } from "../models/contaModel.js";
import { Endereco } from "../models/contaEnderecoModel.js";
import bcrypt from 'bcrypt';

const checkEmailExists = async (email) => {
  try {
    return await Conta.findOne({ where: { email: email}})
  } catch (e) {
    console.log("Erro ao verificar email: " + e);
    throw new Error("Erro ao verificar email" + e);
  }
}

export const register = async (req, res) => {
  try {
    const {name, email, senha, cpf, phone, cep, endereco, numero, complemento, bairro, cidade, estado} = req.body;
    const lowercaseEmail = email.toLowerCase();

    const emailExists = await checkEmailExists(lowercaseEmail);
    if (emailExists) {
      return res.status(400).json({message: "Email ja está cadastrado! Tente fazer login."});
    }

    const is_admin = (email === 'manoelgtcj@gmail.com'? true : false);
    console.log("ai esta: " + isadmin);
    const senhaHash = await bcrypt.hash(senha, 8);

    const novoEndereco = await Endereco.create({
      endereco, numero, cep, bairro, cidade, estado, complemento
    });

    const novaConta = await Conta.create({
      id_endereco: novoEndereco.id_endereco,
      is_admin,
      nome: name,
      email: lowercaseEmail,
      senha: senhaHash,
      cpf,
      telefone: phone
    })
  } catch (e) {
    console.log("Erro ao registrar conta: " + e);
    res.status(500).json({message: "Erro no servidor ao registrar conta."});
  }
}
