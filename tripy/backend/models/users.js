const Sequelize = require("sequelize")
module.exports = class Users extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        nickname: {
          type: Sequelize.STRING(50),
          allowNull: false,
        },
        email: {
          type: Sequelize.STRING(150),
          allowNull: false,
          unique: true,
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
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        createdAt: true,
        updatedAt: false,
        modelName: "Users",
        tableName:"users",
        paranoid: false,
        charset: "utf8",
        collate: "utf8_general_ci",
      },
    );
  }
  static associate(db) {
    db.Users.belongsToMany(db.Trips, {
      through: db.UserTrips, // 문자열 'UserTrips'가 아닌 모델 객체 전달
      foreignKey: "userId",
      otherKey: "tripId",
    });
    // UserTrips를 직접 조작해야 할 때를 위해 hasMany도 유지 가능
    db.Users.hasMany(db.Posts, {
      foreignKey: "userId",
    });
    db.Users.hasMany(db.Photos, { foreignKey: "userId" });
    db.Users.hasMany(db.Bookmarks, { foreignKey: "userId" });
  }
}
