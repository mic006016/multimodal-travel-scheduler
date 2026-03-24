"use strict"

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "themes",
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        themecode: {
          type: Sequelize.STRING(2),
          allowNull: false,
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW,
        },
        tripId: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: {
            model: "trips", // Trips 테이블과 FK 연결
            key: "id",
          },
          onDelete: "SET NULL",
          onUpdate: "CASCADE",
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
    await queryInterface.dropTable("themes")
  },
}
