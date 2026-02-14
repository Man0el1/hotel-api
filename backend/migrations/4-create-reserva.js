export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('reserva', {
    id_reserva: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_conta: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'conta',
        key: 'id_conta'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    check_in: {
      type: Sequelize.DATE,
      allowNull: false
    },
    check_out: {
      type: Sequelize.DATE,
      allowNull: false
    },
    status: {
      type: Sequelize.ENUM("pendente", "confirmada", "concluida", "cancelada"),
      allowNull: false,
      defaultValue: "pendente"
    }
  });

  await queryInterface.addIndex('reserva', ['id_conta']);
}

export async function down(queryInterface) {
  await queryInterface.dropTable('reserva');
}
