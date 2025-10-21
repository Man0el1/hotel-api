import jwt from "jsonwebtoken";

export function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization']; // Bearer <token>
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Token não fornecido" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Token inválido ou expirado" });
    req.user = user; // usar para mostrar dados do usuário em outras rotas (payload)
    return next();
  })
}
