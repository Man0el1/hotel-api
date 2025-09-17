const express = require('express');
const { sequelize, connectToDatabase } = require('./config/db')
const app = express();
const PORT = 8080;

app.use(express.json());

// request = incoming data
// response = data we want to send back to the client
app.get('/tshirt', (req, res) => {
  res.status(200).send({
    tshirt: '👕',
    size: 'large'
  })
});

app.post('/tshirt/:id', (req, res) => {
  const { id } = req.params;
  const { logo } = req.body;

  if(!logo) res.status(418).send({ message: 'We need a logo!' });

  res.status(200).send({
    tshirt: `👕 with ${logo} and id: ${id}`,
  });

})

(async () => {
  await connectToDatabase();

  app.listen(PORT, () => {
    console.log(`Servidor rodando no http://localhost:${PORT}`)
  })
})
