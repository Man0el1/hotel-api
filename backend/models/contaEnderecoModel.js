import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

export const Endereco = sequelize.define('Endereco', {
  id_endereco: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  endereco: {
    type: DataTypes.STRING,
    allowNull: false
  },
  numero: {
    type: DataTypes.STRING(20),
  },
  cep: {
    type: DataTypes.STRING(8),
    allowNull: false
  },
  bairro: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cidade: {
    type: DataTypes.STRING,
    allowNull: false
  },
  estado: {
    type: DataTypes.STRING,
    allowNull: false
  },
  complemento: {
    type: DataTypes.STRING
  }
},{
  tableName: "conta_endereco",
  timestamps: false //prevent createdAt and updatedAt appearing
})
