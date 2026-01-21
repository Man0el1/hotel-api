export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('reserva_quarto', {
    id_reserva: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'reserva',
        key: 'id_reserva'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      primaryKey: true
    },
    id_quarto: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'quarto',
        key: 'id_quarto'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      primaryKey: true
    }
  });

  // 🔥 índices para performance
  await queryInterface.addIndex('reserva_quarto', ['id_reserva']);
  await queryInterface.addIndex('reserva_quarto', ['id_quarto']);
}

export async function down(queryInterface) {
  await queryInterface.dropTable('reserva_quarto');
}
