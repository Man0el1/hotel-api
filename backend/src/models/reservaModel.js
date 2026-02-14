import { DataTypes } from 'sequelize';
import sequelize from '../database/sequelize.js';
import { Conta } from './contaModel.js';

export const Reserva = sequelize.define('Reserva', {
  id_reserva: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
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
    allowNull: false
  },
  check_out: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isAfterCheckIn(value) {
        if (this.check_in && value <= this.check_in) {
          throw new Error('Check-out deve ser depois do check-in');
        }
      }
    }
  },
  status: {
    type: DataTypes.ENUM("pendente", "confirmada", "concluida", "cancelada"),
    defaultValue: "pendente"
  }
},{
  tableName: "reserva",
  timestamps: false
});

Reserva.belongsTo(Conta, { foreignKey: 'id_conta' }); // Uma reserva pertence a uma conta
Conta.hasMany(Reserva, { foreignKey: 'id_conta'}) // Uma conta pode ter muitas reservas

