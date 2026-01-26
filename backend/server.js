import express from 'express';
import sequelize from './src/database/sequelize.js';
import routes from './src/routes.js';

const app = express();

app.use(express.json());
app.use(routes);

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Banco de dados conectado com sucesso');

    app.listen(8000, () => {
      console.log('Servidor rodando na porta 8000');
    });
  } catch (error) {
    console.error('Erro ao conectar no banco:', error);
  }
})();
