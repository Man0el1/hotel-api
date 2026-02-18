import { Op } from "sequelize";
import { Quarto } from "../models/quartoModel.js";
import { Reserva } from "../models/reservaModel.js";
import { ReservaQuarto } from '../models/reservaQuartoModel.js';
import sequelize from "../database/sequelize.js";
//    t = await sequelize.transaction();

const validateUserReserva = async (idUsuario, idReserva) => {
  const reserva = await Reserva.findOne({
    where: {
      id_reserva: idReserva,
    },
    include: {
      model: Quarto,
      attributes: ['id_quarto', 'tipo', 'is_smoker', 'is_front_view'],
      through: { attributes: [] }
    }
  })
  if (!reserva) throw new Error("Reserva não encontrada");
  if (reserva.id_conta !== idUsuario || reserva.status !== "pendente") throw new Error("Acesso negado à reserva");
  return reserva;
}

export const getReservaInfo = async (req, res) => {
  try {
    const idToken = req.user.id;
    const idReserva = req.params.idReserva;
    if (!idReserva) return res.status(400).json({ message: "ID da reserva é obrigatório" });

    const reserva = await validateUserReserva(idToken, idReserva);
    return res.status(200).json({ reserva });
  } catch (e) {
    return res.status(500).json({ message: "Erro: " + e.message });
  }
}
