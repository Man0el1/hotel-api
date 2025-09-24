import { Sequelize } from "sequelize";
import { PostgresDialect } from '@sequelize/postgres'

export const sequelize = new Sequelize('hotel_api', 'manoel', '12341234', {
  host: 'localhost',
  port: 5432,
  dialect: 'postgres',
  ssl: false,
})

export const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("Conectado ao PostgreSQL com sucesso");
  } catch (e) {
    console.log("Erro ao conectar ao PostgreSQL: "+ e);
  }
}
