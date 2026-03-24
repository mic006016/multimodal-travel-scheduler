const express = require("express")
const router = express.Router()
const albumService = require("../services/album_service")

// =========================================================
// 사진 목록 조회 (로그인 필수)
// =========================================================
router.get("/", async (req, res) => {
  try {
    // 1. 로그인 확인
    if (!req.isAuthenticated())
      return res.status(401).json({ error: "로그인이 필요합니다." })

    //2. 서비스 호출
    const data = await albumService.getUserAlbum(req.user.id)

    res.json(data)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "사진 목록 로드 실패" })
  }
})

module.exports = router
