const Sequelize = require("sequelize");
module.exports = class PhotoCategoryMaps extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        confidence_score: {
          type: Sequelize.FLOAT(5, 4),
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
        modelName: "PhotoCategoryMaps",
        tableName: "photoCategoryMaps",
        paranoid: false,
        charset: "utf8",
        collate: "utf8_general_ci",
      },
    );
  }
  static associate(db) {
    db.PhotoCategoryMaps.belongsTo(db.Photos, {
      foreignKey: "photoId",
      onDelete: "CASCADE", // photo 삭제 시 해당 Map의 게시글도 삭제
      onUpdate: "CASCADE",
    });
    db.PhotoCategoryMaps.belongsTo(db.Categories, {
      foreignKey: "categoryId",
      onDelete: "CASCADE", // 카테고리 삭제 시 해당 Map의 게시글도 삭제
      onUpdate: "CASCADE",
    });
  }
};
