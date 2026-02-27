import { Op } from "sequelize";
import { Reserva } from "../models/reservaModel.js";
import sequelize from "../database/sequelize.js";

export const cancelReserva = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const idReserva = req.body;

    const reserva = await Reserva.findOne({
      where: {
        id_reserva: idReserva,
      },
      transaction: t
    })
    if (!reserva) throw new Error("Reserva não existe");
    if (reserva.id_conta !== req.user.id) throw new Error("Usuario não possui acesso");

    reserva.status = "cancelada";
    await reserva.save({ transaction: t });

    await t.commit();
    return res.status(200).json({ message: "Reserva cancelada!" });
  } catch (e) {
    await t.rollback();
    return res.status(500).json({ message: "Erro: " + e.message });
  }
}
