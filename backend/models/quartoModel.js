import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const tiposDeQuarto = [Solteiro, Casal, Familia, Luxo];

export const Quarto = sequelize.define('Quarto', {
  id_quarto: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  numero: {
    type: DataTypes.BOOLEAN
  },
  tipo: {
    type: DataTypes.ENUM[tiposDeQuarto],
    allowNull: false,
  },
  is_smoker: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  is_front_view: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
},{
  tableName: "quarto",
  timestamps: false
});
