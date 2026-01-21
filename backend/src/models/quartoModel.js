import { DataTypes } from 'sequelize';
import sequelize from '../database/sequelize.js';

const tiposDeQuarto = ['SOLTEIRO', 'CASAL', 'FAMILIA', 'LUXO'];

export const Quarto = sequelize.define('Quarto', {
  id_quarto: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  numero: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true
  },
  tipo: {
    type: DataTypes.ENUM(...tiposDeQuarto),
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
