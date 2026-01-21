import jwt from "jsonwebtoken";
import { Conta } from "../models/contaModel.js";
import { Endereco } from "../models/contaEnderecoModel.js";

export const getProfile = async(req, res, next) => {
  try {
    const userId = req.user.id;
    const conta = await Conta.findByPk(userId, {
      attributes: { exclude: ['senha'] }
    });
    if(!conta) return res.status(404).json({message: "Conta não encontrada."});

    const endereco = await Endereco.findByPk(conta.id_endereco);
    if(!endereco) return res.status(404).json({message: "Endereço não encontrado."});

    return res.status(200).json({conta, endereco});
  } catch (e) {
    return res.status(500).json({message: "Erro ao buscar perfil."});
  }
}
