import { Sequelize } from '@sequelize/core'
import { PostgresDialect } from '@sequelize/postgres'

const sequelize = new Sequelize({
  dialect: PostgresDialect,
  database: 'hotel_api',
  user: 'manoel',
  host: 'localhost',
  port: 8080,
  ssl: true,
  clientMinMessages: 'notice'
})

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("Conectado ao PostgreSQL com sucesso");
  } catch (e) {
    console.log("Erro ao conectar ao PostgreSQL: "+ e);
  }
}

module.exports = { sequelize, connectToDatabase };
