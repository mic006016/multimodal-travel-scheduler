"use strict"

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "emotionsTargets",
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        satisfaction: {
          type: Sequelize.STRING(1),
          allowNull: false,
        },
        target: {
          type: Sequelize.STRING(100),
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
        photoId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "photos", // Photos 테이블과 FK 연결
            key: "id",
          },
          onDelete: "CASCADE",
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
    await queryInterface.dropTable("emotionsTargets")
  },
}
