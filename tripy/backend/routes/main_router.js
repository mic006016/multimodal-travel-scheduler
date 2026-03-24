const express = require("express")
const {
  getTripCountById,
  getPostById,
  getPostsByIdAll,
} = require("../db/trips_db")
const router = express.Router()

// ==================== 인증 미들웨어 ====================
function requireAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  return res.status(401).json({ error: "로그인이 필요합니다." })
}

module.exports = router

// ==================== 게시글 목록, 여행 통계 ====================
router.get("/", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id // 로그인된 사용자 ID
    const posts = await getPostsByIdAll(userId)
    const tripCount = await getTripCountById(userId)

    return res.status(200).json({ posts, tripCount })
  } catch (err) {
    console.error("게시글 목록 조회 오류:", err)
    return res.status(500).json({ error: "서버 오류" })
  }
})
