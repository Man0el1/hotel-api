const tiposDeQuarto = ['SOLTEIRO', 'CASAL', 'FAMILIA', 'LUXO'];

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('quarto', {
    id_quarto: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    numero: {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: true
    },
    tipo: {
      type: Sequelize.ENUM(...tiposDeQuarto),
      allowNull: false
    },
    is_smoker: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    is_front_view: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    }
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('quarto');
}
