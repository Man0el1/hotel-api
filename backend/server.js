import express from 'express';
import helmet from "helmet";
import cors from 'cors';
import routes from './routes.js'
import { connectToDatabase } from './config/db.js';
const app = express();

const PORT = 8080;

app.use(cors({origin: "http://localhost:3000"}));
app.use(express.json());
app.use(helmet());
app.use(routes);

const startServer = async () => {
  try {
    await connectToDatabase();
    app.listen(PORT, () => {
      console.log(`Servidor rodando no http://localhost:${PORT}`)
    });
  } catch (e) {
    console.error("Erro ao iniciar servidor:", e);
  }
};

startServer();
