"use strict"

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "categories",
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        category: {
          type: Sequelize.STRING(50),
          allowNull: false,
        },
        createdAt: {
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
    await queryInterface.dropTable("categories")
  },
}
