const { Photos, PhotoCategoryMaps, Categories } = require("../models");

const albumDb = {
  // 1. 내 사진 중 중복 체크 (날짜 + 사용자ID)
  findMyPhoto: async (userId, takenAt) => {
    return await Photos.findOne({
      where: {
        takenAt: takenAt,
        UserId: userId,
      },
      include: [{ model: PhotoCategoryMaps, include: [Categories] }],
    });
  },

  // 2. 전체 사용자 중 중복 체크 (날짜 기준, 파일 재사용)
  findGlobalPhoto: async (takenAt) => {
    return await Photos.findOne({
      where: { takenAt: takenAt },
    });
  },

  // 3. 사진 정보 저장
  createPhoto: async (data, t) => {
    return await Photos.create(data, { transaction: t });
  },

  // 4. 카테고리 매핑 정보 저장
  createCategoryMaps: async (mapData, t) => {
    return await PhotoCategoryMaps.bulkCreate(mapData, { transaction: t });
  },

  // 5. 사진 목록 조회 (카테고리 포함)
  getUserPhotos: async (userId) => {
    return await Photos.findAll({
      where: { UserId: userId },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: PhotoCategoryMaps,
          attributes: ["confidence_score"],
          include: [
            {
              model: Categories,
              attributes: ["category"],
            },
          ],
        },
      ],
    });
  },
};

module.exports = albumDb;
