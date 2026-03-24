"use strict"

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "photos",
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        photo: {
          type: Sequelize.STRING(200),
          allowNull: false,
        },
        url: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        takenAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        latitude: {
          type: Sequelize.FLOAT(9, 6),
          allowNull: true,
        },
        longitude: {
          type: Sequelize.FLOAT(9, 6),
          allowNull: true,
        },
        address: {
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW,
        },
        userId: {
          type: Sequelize.INTEGER,
          allowNull: true, // NULL 허용
          references: { model: "users", key: "id" },
          onDelete: "SET NULL",
          onUpdate: "CASCADE",
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
    await queryInterface.dropTable("photos")
  },
}
