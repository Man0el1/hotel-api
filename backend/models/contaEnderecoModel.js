import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const estados = [AC,AL,AP,AM,BA,CE,DF,ES,GO,MA,MT,MS,MG,PA,PB,PR,PE,PI,RJ,RN,RS,RO,RR,SC,SP,SE,TO]

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
    type: DataTypes.ENUM[estados],
    allowNull: false
  },
  complemento: {
    type: DataTypes.STRING
  }
},{
  tableName: "conta_endereco",
  timestamps: false //prevent createdAt and updatedAt appearing
})
