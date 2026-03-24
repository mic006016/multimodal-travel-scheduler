"use strict"

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "bookmarks",
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        location: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        description: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        userId: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: {
            model: "users", // Users 테이블과 FK 연결
            key: "id",
          },
          onDelete: "SET NULL", // 유저 삭제 시 북마크도 삭제
          onUpdate: "CASCADE",
        },
        // createdAt, updatedAt을 모델에서 false로 했으므로 여기서는 제외
      },
      {
        charset: "utf8mb4",
        collate: "utf8mb4_unicode_ci",
      },
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("bookmarks")
  },
}
