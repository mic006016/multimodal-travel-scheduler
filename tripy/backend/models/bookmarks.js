const Sequelize = require("sequelize")
module.exports = class Bookmarks extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        location: { type: Sequelize.STRING(100), allowNull: false },
        description: { type: Sequelize.TEXT, allowNull: true },
      },
      {
        sequelize,
        underscored: false,
        modelName: "Bookmarks",
        tableName:'bookmarks',
        createdAt: false,
        updatedAt: false,
        paranoid: false,
        charset: "utf8",
        collate: "utf8_general_ci",
      },
    );
  }
  static associate(db) {
    db.Bookmarks.belongsTo(db.Users, {
      foreignKey: "userId",
      onDelete: "CASCADE", // 유저 삭제 시 해당 유저의 게시글도 삭제
      onUpdate: "CASCADE",
    });
  }
}
