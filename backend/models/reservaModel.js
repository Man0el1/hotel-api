import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import { Conta } from './contaModel.js';

const data = new Date();
const dataAtual = data.toISOString().split("T")[0]

export const Reserva = sequelize.define('Reserva', {
  id_reserva: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  id_conta: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Conta,
      key: 'id_conta'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  check_in: {
    type: DataTypes.DATE,
  },
  check_out: {
    type: DataTypes.DATE,
    validate: {
      isAfter: dataAtual
    }
  }
},{
  tableName: "reserva",
  timestamps: false
});

Reserva.belongsTo(Conta, { foreignKey: 'id_conta' })
Conta.hasMany(Reserva, { foreignKey: 'id_conta'})
