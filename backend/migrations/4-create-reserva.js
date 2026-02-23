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
    valor_total: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    status: {
      type: Sequelize.STRING, //("pendente", "confirmada", "ativa", "concluida", "expirada", "cancelada"),
      allowNull: false,
      defaultValue: "pendente"
    },
    expires_at: {
      type: Sequelize.DATE,
      allowNull: true
    }
  });

  await queryInterface.addIndex('reserva', ['id_conta']);
}

export async function down(queryInterface) {
  await queryInterface.dropTable('reserva');
}
