export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('conta', {
    id_conta: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_endereco: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'conta_endereco',
        key: 'id_endereco'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    is_admin: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    nome: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    senha: {
      type: Sequelize.STRING,
      allowNull: false
    },
    cpf: {
      type: Sequelize.STRING(11),
      allowNull: false,
      unique: true
    },
    telefone: {
      type: Sequelize.STRING,
      allowNull: false,
    }
  });

  await queryInterface.addIndex('conta', ['id_endereco']);
}

export async function down(queryInterface) {
  await queryInterface.dropTable('conta');
}
