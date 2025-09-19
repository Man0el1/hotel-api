import { Sequelize } from '@sequelize/core'
import { PostgresDialect } from '@sequelize/postgres'

export const sequelize = new Sequelize({
  dialect: PostgresDialect,
  database: 'hotel_api',
  password: '12341234',
  user: 'manoel',
  host: 'localhost',
  port: 5432,
  ssl: false,
  clientMinMessages: 'notice'
})

export const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("Conectado ao PostgreSQL com sucesso");
  } catch (e) {
    console.log("Erro ao conectar ao PostgreSQL: "+ e);
  }
}
