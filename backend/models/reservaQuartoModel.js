import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import { Quarto } from './quartoModel.js';
import { Reserva } from './reservaModel.js';

export const ReservaQuarto = sequelize.define('ReservaQuarto', {
  id_reserva: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Reserva,
      key: 'id_reserva'
    }
  },
  id_quarto: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Quarto,
      key: 'id_quarto'
    }
  }
},{
  tableName: "reserva_quarto",
  timestamps: false
})

Reserva.belongsToMany(Quarto, {through: ReservaQuarto, foreignKey: 'id_reserva', otherKey: 'id_quarto'});
Quarto.belongsToMany(Reserva, {through: ReservaQuarto, foreignKey: 'id_quarto', otherKey: 'id_reserva'});
