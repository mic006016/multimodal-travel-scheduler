const Sequelize = require("sequelize")
module.exports = class Posts extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        post: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        points: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
        },
        createdAt: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW,
        },
        photoId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          unique: true, // 이 설정이 있어야 실제 DB에 Unique 제약조건이 생성됩니다.
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        updatedAt: false,
        modelName: "Posts",
        tableName: "posts",
        paranoid: false,
        charset: "utf8",
        collate: "utf8_general_ci",
      },
    );
  }
  static associate(db) {
    db.Posts.belongsTo(db.Photos, {
      foreignKey: "photoId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    db.Posts.belongsTo(db.Users, {
      foreignKey: "userId",
      onDelete: "CASCADE", // 유저 삭제 시 해당 유저의 게시글도 삭제
      onUpdate: "CASCADE",
    });
  }
}
