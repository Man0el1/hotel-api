import cron from "node-cron";
import { Reserva } from "../models/reservaModel.js";
import { Op } from "sequelize";

let isRunning = false;

export const startConcluirReservasJob = () => {
  cron.schedule("*/5 * * * *", async () => {

    if (isRunning) return;
    isRunning = true;

    try {
      await Reserva.update(
        {status: "concluida"},
        {
          where: {
            status: {
              [Op.in]: ["confirmada", "ativa"]
            },
            check_out: {[Op.lte]: new Date() }
          }
        }
      );

      await Reserva.update(
        {status: "ativa"},
        {
          where: {
            status: "confirmada",
            check_in: {[Op.lte]: new Date() }
          }
        }
      )
    } catch (e) {
      console.error("Erro ao concluir reservas: ", e);
    } finally {
      isRunning = false
    }
  });
}
