import { DataTypes } from 'sequelize';
import sequelize from '../database/sequelize.js';
import { Endereco } from './contaEnderecoModel.js';

export const Conta = sequelize.define('Conta', {
  id_conta: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_endereco: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Endereco,
      key: 'id_endereco'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  is_admin: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { is: /^[A-Za-z\s]+$/ }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true }
  },
  senha: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cpf: {
    type: DataTypes.STRING(11),
    allowNull: false,
    unique: true
  },
  telefone: {
    type: DataTypes.STRING,
    allowNull: false,
  }
},{
  tableName: "conta",
  timestamps: false
});

Conta.belongsTo(Endereco, { foreignKey: 'id_endereco' }); // 1 conta pertence a 1 endereco
Endereco.hasMany(Conta, { foreignKey: 'id_endereco' }); // 1 endereco pode ter n contas
// hasOne, hasMany, belongsTo, belongsToMany
