"use strict"

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "photoCategoryMaps",
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        confidence_score: {
          type: Sequelize.FLOAT(5, 4),
          allowNull: false,
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW,
        },
        photoId: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: {
            model: "photos", // Photos 테이블과 FK 연결
            key: "id",
          },
          onDelete: "SET NULL",
          onUpdate: "CASCADE",
        },
        categoryId: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: {
            model: "categories", // Categories 테이블과 FK 연결
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
    await queryInterface.dropTable("photoCategoryMaps")
  },
}
