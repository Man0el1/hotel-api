import { startExpiraReservasJob } from "./expiraReservasJob.js";
import { startConcluirReservasJob } from "./concluirReservasJob.js";

export const startAllJobs = () => {
  startExpiraReservasJob();
  startConcluirReservasJob();
};
