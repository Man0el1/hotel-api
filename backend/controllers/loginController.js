import { Conta } from "../models/contaModel.js";
import bcrypt from 'bcrypt';

export const accountExists = async (req, res) => {
  try {
    const {email, senha} = req.body;
    const senhaHash = await bcrypt.hash(senha, 8);

    const conta = await Conta.findOne({where: {email: email}})
    if (!conta) return res.status(403).json({message: "Email ou senha errada."});

    const senhaCorreta = await bcrypt.compare(senhaHash, conta.senha);
    if (!senhaCorreta) return res.status(403).json({message: "Email ou senha errada."});

    return res.status(200).json({message: "Login concluido."})

  } catch (e) {
    return res.status(500).json({message: "Erro no servidor ao registrar conta."});
  }
}
