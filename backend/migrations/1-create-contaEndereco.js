export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('conta_endereco', {
    id_endereco: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    endereco: {
      type: Sequelize.STRING,
      allowNull: false
    },
    numero: {
      type: Sequelize.STRING(20),
    },
    cep: {
      type: Sequelize.STRING(8),
      allowNull: false
    },
    bairro: {
      type: Sequelize.STRING,
      allowNull: false
    },
    cidade: {
      type: Sequelize.STRING,
      allowNull: false
    },
    estado: {
      type: Sequelize.STRING,
      allowNull: false
    },
    complemento: {
      type: Sequelize.STRING
    }
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('conta_endereco');
}
