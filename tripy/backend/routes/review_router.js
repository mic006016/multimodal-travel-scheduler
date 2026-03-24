const express = require("express")
// 구조 분해 할당으로 함수들을 가져옵니다.
const {
  getPostById,
  getPostsByIdAll,
  savePhotoDescription,
  updateTripDescription,
} = require("../db/trips_db")
const router = express.Router()

// ==================== 인증 미들웨어 ====================
function requireAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  return res.status(401).json({ error: "로그인이 필요합니다." })
}

// ==================== 게시글 목록 ====================
router.get("/", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id // 로그인된 사용자 ID
    const posts = await getPostsByIdAll(userId)

    return res.status(200).json(posts)
  } catch (err) {
    console.error("게시글 목록 조회 오류:", err)
    return res.status(500).json({ error: "서버 오류" })
  }
})

router.get("/:id", requireAuth, async (req, res) => {
  try {
    const tripId = req.params.id

    // DB 조회
    const post = await getPostById(tripId)

    if (!post) {
      return res.status(404).json({ error: "게시글을 찾을 수 없습니다." })
    }

    // [수정됨] 조회된 데이터에 현재 로그인한 유저 ID를 추가해서 응답
    // req.user.id는 requireAuth 미들웨어를 통과했다면 반드시 존재합니다.
    const responseData = {
      ...post,
      currentUserId: req.user.id,
    }

    return res.status(200).json(responseData)
  } catch (err) {
    console.error("게시글 상세 조회 오류:", err)
    return res.status(500).json({ error: "서버 오류" })
  }
})

// ==================== [수정됨] 개별 사진 설명 저장 ====================
// 저장 버튼 클릭 시 호출됨
// 로그인 체크 미들웨어(requireAuth) 복구 필요
router.post("/:tripId/descriptions/:photoId", requireAuth, async (req, res) => {
  try {
    const { photoId } = req.params
    const { post } = req.body

    // [수정] 실제 로그인된 유저 ID 사용 (하드코딩 제거)
    // req.user가 없는 경우를 대비해 안전장치 추가 (미들웨어로 처리되겠지만 이중 체크)
    const userId = req.user ? req.user.id : null

    if (!userId) {
      return res.status(401).json({ error: "로그인이 필요합니다." })
    }

    if (post === undefined) {
      return res.status(400).json({ error: "내용이 없습니다." })
    }

    // DB 저장 함수 호출
    await savePhotoDescription(photoId, userId, post)

    return res.status(200).json({ message: "성공적으로 저장되었습니다." })
  } catch (err) {
    // [추가] 권한 에러 처리 (다른 사람의 글을 수정하려 할 때)
    if (err.message === "PERMISSION_DENIED") {
      return res
        .status(403)
        .json({ error: "본인이 작성한 글만 수정할 수 있습니다." })
    }

    console.error("개별 사진 설명 저장 오류:", err)
    return res.status(500).json({ error: "서버 오류" })
  }
})

router.put("/:id/description", requireAuth, async (req, res) => {
  try {
    const tripId = req.params.id
    const { description } = req.body

    if (!description) {
      return res.status(400).json({ error: "요약 내용이 없습니다." })
    }

    // DB 업데이트 함수 호출
    await updateTripDescription(tripId, description)

    return res
      .status(200)
      .json({ message: "요약이 성공적으로 저장되었습니다." })
  } catch (err) {
    console.error("요약 저장 오류:", err)
    return res.status(500).json({ error: "서버 오류" })
  }
})

module.exports = router
