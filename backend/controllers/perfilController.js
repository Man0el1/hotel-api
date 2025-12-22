import jwt from "jsonwebtoken";
import { Conta } from "../models/contaModel.js";

export async function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization']; // Bearer <token>
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Token não fornecido" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const usuario = await Conta.findByPk(decoded.id);
    if (!usuario) return res.status(401).json({ message: "Usuário não existe mais" });

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Token inválido ou expirado" });
  }
}
