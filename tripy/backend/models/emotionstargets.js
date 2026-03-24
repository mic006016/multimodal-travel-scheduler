const Sequelize = require("sequelize");
module.exports = class EmotionsTargets extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        satisfaction: {
          //만족여부
          type: Sequelize.STRING(1),
          allowNull: false,
        },
        target: {
          type: Sequelize.STRING(100),
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
        modelName: "EmotionsTargets",
        tableName: "emotionsTargets",
        paranoid: false,
        charset: "utf8",
        collate: "utf8_general_ci",
      },
    );
  }
  static associate(db) {
    db.EmotionsTargets.belongsTo(db.Trips, {
      foreignKey: "tripId",
      onDelete: "CASCADE", // photo 삭제 시 해당 유저의 게시글도 삭제
      onUpdate: "CASCADE",
    });
    db.EmotionsTargets.belongsTo(db.Photos, {
      foreignKey: "photoId",
      onDelete: "CASCADE", // photo삭제 시 해당 유저의 게시글도 삭제
      onUpdate: "CASCADE",
    });
  }
};
