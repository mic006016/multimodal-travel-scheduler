const Sequelize = require("sequelize");
module.exports = class UserTrips extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        Owner: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        createdAt: false,
        updatedAt: false,
        modelName: "UserTrips",
        tableName: "usertrip",
        paranoid: false,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }
  static associate(db) {
    db.UserTrips.belongsTo(db.Users, {
      foreignKey: "userId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    db.UserTrips.belongsTo(db.Trips, {
      foreignKey: "tripId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  }
};
