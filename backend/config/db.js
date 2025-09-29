import { Sequelize } from "sequelize";

const sequelize = new Sequelize('hotel_api', 'manoel', '12341234', {
  host: 'localhost',
  port: 5432,
  dialect: 'postgres',
  ssl: false,
})

export default sequelize;

export const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log("Conectado ao PostgreSQL com sucesso");
  } catch (e) {
    console.log("Erro ao conectar ao PostgreSQL: "+ e);
  }
}
