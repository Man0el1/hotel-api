import { Op } from "sequelize";
import { Reserva } from "../models/reservaModel.js";
import sequelize from "../database/sequelize.js";

export const xxx = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const idReserva = req.body;


    const reserva = await Reserva.findOne({
      where: {
        id_reserva: idReserva,
      },
      include: {
        model: Quarto,
        attributes: ['id_quarto', 'tipo', 'is_smoker', 'is_front_view'],
        through: { attributes: [] }
      },
      transaction: t
    })
    if (!reserva) throw new Error("Reserva não encontrada");
    if (reserva.id_conta !== idUsuario || reserva.status !== "pendente") throw new Error("Acesso negado à reserva");
    await t.commit();
    return res.status(200).json({ message: "Reserva concluida!" });
  } catch (e) {
    await t.rollback();
    return res.status(500).json({ message: "Erro: " + e.message });
  }
}
