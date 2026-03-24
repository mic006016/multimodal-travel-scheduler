const express = require("express")
const router = express.Router()
const fs = require("fs")
const upload = require("../middlewares/multer_config")
const albumService = require("../services/album_service")

// =========================================================
// 사진 업로드 (로그인 필수)
// =========================================================
router.post("/", upload.single("file"), async (req, res) => {
  try {
    // 1. 로그인 여부 확인 (Passport가 제공하는 함수)
    if (!req.isAuthenticated())
      return res.status(401).json({ error: "로그인이 필요합니다." })

    // 2. 파일 유효성 검사
    if (!req.file) {
      return res.status(400).json({ error: "파일 없음" })
    }

    const result = await albumService.uploadProcess(req.user.id, req.file)

    res.status(200).json(result)
  } catch (err) {
    console.error(err)
    // 에러 발생 시 임시 파일 정리
    if (req.file && require("fs").existsSync(req.file.path)) {
      fs.unlink(req.file.path, () => {})
    }
    res.status(500).json({ error: "서버 내부 에러" })
  }
})

module.exports = router
