"use strict"

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "usertrip",
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        Owner: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        userId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "users", // Users 테이블과 FK 연결
            key: "id",
          },
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        },
        tripId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "trips", // Trips 테이블과 FK 연결
            key: "id",
          },
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        },
        // createdAt, updatedAt은 모델에서 false로 설정했으므로 제외
      },
      {
        charset: "utf8mb4",
        collate: "utf8mb4_unicode_ci",
      },
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("usertrip")
  },
}
