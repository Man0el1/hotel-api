import { Conta } from "../models/contaModel.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';

export const accountExists = async (req, res) => {
  try {
    const {email, senha} = req.body;

    const conta = await Conta.findOne({where: {email: email}})
    if (!conta) return res.status(403).json({message: "Email."});

    const senhaCorreta = await bcrypt.compare(senha, conta.senha);
    if (!senhaCorreta) return res.status(403).json({message: "senha errada."});

    const token = jwt.sign(
      { id: conta.id_conta },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({message: "Login concluido.", token});

  } catch (e) {
    return res.status(500).json({message: "Erro no servidor entrar na conta."});
  }
}
