const axios = require("axios")
const FormData = require("form-data")
const fs = require("fs")
const exifr = require("exifr")
// sequelize 객체 가져오기 (트랜잭션용)
const { sequelize } = require("../models")
// DB 모듈 임포트
const albumDb = require("../db/album_db")
// AI 서버 주소
require("dotenv").config()
// const AI_SERVER_URL = "http://localhost:8000/album/category";  // 로컬 개발 시 주소
const AI_SERVER_URL = `${process.env.AI_SERVER_URL}/album/category` // Docker

const albumService = {
  // =================================================================
  // [메인] 업로드 프로세스 함수
  // =================================================================
  uploadProcess: async (userId, file) => {
    let finalPath = file.path
    let finalFilename = file.filename

    // 1. Exif 메타데이터 추출
    let meta = {}
    try {
      meta = await exifr.parse(file.path, { gps: true, tiff: true })
    } catch (e) {
      console.warn("메타데이터 추출 실패:", e.message)
    }
    const takenAt = meta?.DateTimeOriginal || null
    const lat = meta?.latitude || null
    const lon = meta?.longitude || null

    // 2. DB 중복체크
    if (takenAt) {
      // (1) 내 중복 확인
      const myPhoto = await albumDb.findMyPhoto(userId, takenAt)
      if (myPhoto) {
        // 방금 업로드된 임시 파일 삭제
        fs.unlink(file.path, () => {})
        return {
          isDuplicate: true,
          photoId: myPhoto.id,
          message: "이미 등록한 사진입니다.",
        }
      }

      // (2) 타인 중복 확인 (파일 재사용)
      const otherPhoto = await albumDb.findGlobalPhoto(takenAt)
      if (otherPhoto) {
        // 1. 방금 내가 올린 파일은 필요 없으니 삭제
        fs.unlink(file.path, () => {})

        // 2. 기존에 있던 파일의 경로를 내 DB에 저장하기 위해 변수 교체
        finalPath = otherPhoto.url
        finalFilename = otherPhoto.photo
      }
    }

    // 3. 주소 변환(Reverse Geocoding) (내부 함수 호출)
    let addressValue = "위치 정보 없음"
    if (lat && lon) {
      addressValue = await convertAddress(lat, lon)
    }

    // 4. AI 분석 (내부 함수 호출)
    if (!fs.existsSync(finalPath)) {
      throw new Error("분석할 파일이 존재하지 않습니다.")
    }
    const aiResults = await requestAiAnalysis(finalPath)

    // =========================================================
    // 5. & 6. DB 저장을 트랜잭션으로 묶기 (All or Nothing)
    // =========================================================
    const t = await sequelize.transaction()

    let newPhoto
    try {
      // 5. Photo 저장 (트랜잭션 객체 t 전달)
      newPhoto = await albumDb.createPhoto(
        {
          userId: userId,
          photo: finalFilename,
          url: finalPath,
          takenAt: takenAt || new Date(),
          latitude: lat || null,
          longitude: lon || null,
          address: addressValue,
        },
        t,
      )

      // 6. Category 저장
      const validCategories = aiResults.filter((r) => r.score >= 0.3)
      if (validCategories.length > 0) {
        const mapData = validCategories.map((item) => ({
          photoId: newPhoto.id,
          categoryId: item.category_id,
          confidence_score: item.score,
        }))
        // (트랜잭션 객체 t 전달)
        await albumDb.createCategoryMaps(mapData, t)
      }

      await t.commit()
    } catch (dbErr) {
      // 저장 중에 에러나면 지금까지 한 DB 작업 취소
      await t.rollback()
      console.error("[Transaction] Rollback executed due to:", dbErr)
      throw dbErr // 에러를 라우터로 던져서 500 응답 & 파일삭제 하게 함
    }

    return {
      photoId: newPhoto.id,
      results: aiResults,
      address: addressValue,
      message: "업로드 및 분석 완료",
    }
  },

  // =================================================================
  // [메인] 조회 함수
  // =================================================================
  getUserAlbum: async (userId) => {
    const allPhotos = await albumDb.getUserPhotos(userId)

    return allPhotos.map((photo) => {
      const maps = photo.PhotoCategoryMaps || []
      maps.sort((a, b) => b.confidence_score - a.confidence_score)

      return {
        id: photo.id,
        url: `${process.env.BASE_URL}/${photo.url}`,
        date: new Date(photo.takenAt).toISOString().split("T")[0],
        location: photo.address || "위치 정보 없음",
        category: maps[0]?.Category?.category || "기타",
      }
    })
  },
}

// =================================================================
// [Helper Functions] 복잡한 외부 통신 코드는 아래로 몰아넣음
// =================================================================

// 1. 좌표 -> 주소 변환 (Nominatim)
async function convertAddress(lat, lon) {
  let addressResult = "위치 정보 없음"

  try {
    const geoRes = await axios.get(
      `https://nominatim.openstreetmap.org/reverse`,
      {
        params: {
          format: "json",
          lat,
          lon,
          "accept-language": "ko",
          zoom: 18,
          addressdetails: 1,
        },
        headers: {
          // 중요: Nominatim은 User-Agent 헤더가 없으면 차단함
          "User-Agent": "MyPhotoAbumApp/1.0",
        },
      },
    )

    if (geoRes.data && geoRes.data.address) {
      const addr = geoRes.data.address
      // geoRes.data.address 객체에서 시/구/동만 추출
      // 1. 시/도 (우선순위: city > province)
      const si = addr.city || addr.province || null

      // 2. 구/군 (우선순위: borough > district > county)
      // 서울의 '구'는 보통 borough, 지방의 '군'은 county
      const gu = addr.borough || addr.district || addr.county || null

      // 3. 동/읍/면 (우선순위: quarter > neighbourhood > hamlet > village)
      // quarter가 가장 흔한 '동', hamlet은 '리' 단위
      const dong =
        addr.quarter ||
        addr.neighbourhood ||
        addr.hamlet ||
        addr.village ||
        null

      // 4. 문자열 합치기 (공백 제거)
      const validAddress = [si, gu, dong].filter((v) => v).join(" ")

      // 만약 셋 다 null이라서 빈 문자열이 되면 기존 기본값 유지, 아니면 덮어쓰기
      if (validAddress) {
        addressResult = validAddress
      }

      console.log("변환된 주소(시/구/동):", addressResult)
    }
  } catch (geoErr) {
    console.error("주소 변환 실패:", geoErr.message)
  }
  return addressResult
}

// 2. AI 서버 분석 요청
async function requestAiAnalysis(filePath) {
  const formData = new FormData()
  formData.append("file", fs.createReadStream(filePath))

  const aiResponse = await axios.post(AI_SERVER_URL, formData, {
    headers: { ...formData.getHeaders() },
  })
  return aiResponse.data.results || []
}

module.exports = albumService
