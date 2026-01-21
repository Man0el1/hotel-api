import { Conta } from "../models/contaModel.js";
import { Endereco } from "../models/contaEnderecoModel.js";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

const checkEmailExists = async (email) => {
  try {
    return await Conta.findOne({ where: { email: email}})
  } catch (e) {
    throw new Error("Erro ao verificar email" + e);
  }
}

const checkCpfExists = async (cpf) => {
  try {
    return await Conta.findOne({ where: { cpf: cpf }})
  } catch (e) {
    throw new Error("Erro ao verificar cpf" + e);
  }
}

export const registerAccount = async (req, res) => {
  try {
    const {name, email, senha, cpf, phone, cep, endereco,
      numero, complemento, bairro, cidade, estado} = req.body;
    const lowercaseEmail = email.toLowerCase();

    const emailExists = await checkEmailExists(lowercaseEmail);
    const cpfExists = await checkCpfExists(cpf);
    if (emailExists || cpfExists) return res.status(403).json(
      {message: "Conta já está cadastrada! Tente fazer login."});

    const isAdmin = (lowercaseEmail === 'manoelgtcj@gmail.com'? true : false);
    const senhaHash = await bcrypt.hash(senha, 8);

    let enderecoExistente = await Endereco.findOne({
      where: { endereco, numero, cep, bairro, cidade, estado, complemento }
    })
    if (!enderecoExistente) {
      enderecoExistente = await Endereco.create({
        endereco, numero, cep, bairro, cidade, estado, complemento
      });
    }

    const novaConta = await Conta.create({
      id_endereco: enderecoExistente.id_endereco,
      is_admin: isAdmin,
      nome: name,
      email: lowercaseEmail,
      senha: senhaHash,
      cpf: cpf,
      telefone: phone
    });

    const token = jwt.sign(
      { id: novaConta.id_conta },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    return res.status(201).json({
      message: "Conta criada com sucesso! Agora você pode fazer login.", token
    });

  } catch (e) {
    return res.status(500).json({message: "Erro no servidor ao registrar conta. " + e});
  }
}
