"use strict"

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "trips",
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        title: {
          type: Sequelize.STRING(50),
          allowNull: false,
        },
        description: {
          type: Sequelize.STRING(250),
          allowNull: true,
        },
        plan: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        score: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW,
        },
        start_date: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW,
        },
        end_date: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW,
        },
        // updatedAt은 모델에서 false로 설정했으므로 제외
      },
      {
        charset: "utf8mb4",
        collate: "utf8mb4_unicode_ci",
      },
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("trips")
  },
}
