import cron from "node-cron";
import { Reserva } from "../models/reservaModel.js";
import { Op } from "sequelize";

let isRunning = false;

export const startExpiraReservasJob = () => {
  cron.schedule("* * * * *", async () => {

    if (isRunning) return;
    isRunning = true;

    try {
      await Reserva.update(
        {status: "expirada"},
        {
          where: {
            status: "pendente",
            expires_at: {[Op.lt]: new Date() }
          }
        }
      )
    } catch (e) {
      console.error("Erro ao expirar reservas: ", e);
    } finally {
      isRunning = false
    }
  });
}
