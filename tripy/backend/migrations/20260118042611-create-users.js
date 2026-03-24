"use strict"

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "users",
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        nickname: {
          type: Sequelize.STRING(50),
          allowNull: false,
        },
        email: {
          type: Sequelize.STRING(150),
          allowNull: false,
          unique: true, // UNIQUE 제약조건
        },
        password: {
          type: Sequelize.STRING(200),
          allowNull: false,
        },
        search: {
          type: Sequelize.TINYINT,
          allowNull: false,
          defaultValue: false,
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
    await queryInterface.dropTable("users")
  },
}
