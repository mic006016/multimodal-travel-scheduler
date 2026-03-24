const Sequelize = require("sequelize")
module.exports = class Trips extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        title: {
          type: Sequelize.STRING(50),
          allowNull: false,
        },
        description: {
          type: Sequelize.STRING(250),
          allowNull: true,
        },
        plan: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        score: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
        },
        createdAt: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW,
        },
        start_date: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW,
        },
        end_date: {
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
        modelName: "Trips",
        tableName: "trips",
        paranoid: false,
        charset: "utf8",
        collate: "utf8_general_ci",
      },
    );
  }
  static associate(db) {
    db.Trips.belongsToMany(db.Users, {
      through: db.UserTrips, // 문자열 'UserTrips'가 아닌 모델 객체 전달
      foreignKey: "tripId",
      otherKey: "userId",
    });
    db.Trips.hasMany(db.Photos, { foreignKey: "tripId" });
    db.Trips.hasMany(db.EmotionsTargets, { foreignKey: "tripId" });

    db.Trips.hasMany(db.Themes, { foreignKey: "tripId" });
  }
};
