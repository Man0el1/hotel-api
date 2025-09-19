import express from 'express';
import cors from 'cors';
import { sequelize, connectToDatabase } from './config/db.js';
const app = express();
const PORT = 8080;

app.use(cors({origin: "http://localhost:3000"}));
app.use(express.json());

// request = incoming data
// response = data we want to send back to the client
app.get('/tshirt', (req, res) => {
  res.status(200).json({
    tshirt: '👕',
    size: 'large'
  })
});

app.post('/tshirt/:id', (req, res) => { // example: localhost:8080/tshirt/123
  const { id } = req.params;
  const { logo } = req.body;

  if(!logo) res.status(418).json({ message: 'We need a logo!' });

  res.status(200).json({
    tshirt: `👕 with ${logo} and id: ${id}`,
  });

})

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
