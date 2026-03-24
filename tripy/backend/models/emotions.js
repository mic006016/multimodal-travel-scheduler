const Sequelize = require("sequelize")
module.exports = class Emotions extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        category: {
          type: Sequelize.STRING(2),
          allowNull: false,
        },
        satisfaction: {
          type: Sequelize.STRING(1),
          allowNull: false,
        },
        createdAt: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        createdAt: true,
        updatedAt: false,
        modelName: "Emotions",
        tableName: "emotions",
        paranoid: false,
        charset: "utf8",
        collate: "utf8_general_ci",
      },
    );
  }
  static associate(db) {
    db.Emotions.belongsTo(db.Trips, {
      foreignKey: "tripId",
      onDelete: "CASCADE", // 유저 삭제 시 해당 유저의 게시글도 삭제
      onUpdate: "CASCADE",
    });
    db.Emotions.belongsTo(db.Photos, {
      foreignKey: "photoId",
      onDelete: "CASCADE", // 유저 삭제 시 해당 유저의 게시글도 삭제
      onUpdate: "CASCADE",
    });
  }
}
