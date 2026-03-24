import { useEffect, useState } from "react"
import { useAuthStore } from "../../store/authStore"
import { useNavigate } from "react-router-dom"
import Loading from "../../components/Loading"
import "./Recommend.css"

const Recommend = () => {
  const { user, isChecking } = useAuthStore()
  const navigate = useNavigate()

  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [bookmarkMsg, setBookmarkMsg] = useState("")
  const [bookmarked, setBookmarked] = useState([])
  const AI_URL = import.meta.env.VITE_AI_URL

  // -----------------------------
  // 추천 여행지 불러오기
  // -----------------------------
  useEffect(() => {
    if (isChecking || !user) return

    const fetchRecommendations = async () => {
      if (!user?.id) {
        setError("로그인 정보를 불러오는 중 문제가 발생했습니다.")
        return
      }

      setLoading(true)
      setError("")

      try {
        const [recRes, bmRes] = await Promise.all([
          fetch("/ai/recommend/tour", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ count: 3, userId: user.id }),
          }),
          fetch(`${AI_URL}/bookmark/list?userid=${user.id}`),
        ])

        const recData = await recRes.json()
        const bmData = await bmRes.json()

        const bmLocations = bmData.bookmarks.map((b) => b.location)
        setBookmarked(bmLocations)

        // 북마크와 추천 여행지 중복 제거
        const filteredRecommendations = (recData.recommendations || []).filter(
          (r) => !bmLocations.includes(r.title),
        )

        // 북마크 항목 먼저 + 추천 여행지 뒤
        const combined = [
          ...bmData.bookmarks.map((b) => ({
            title: b.location,
            reason: b.description,
          })),
          ...filteredRecommendations,
        ]

        setRecommendations(combined)
      } catch (err) {
        console.error(err)
        setError("추천 여행지 불러오기 중 오류가 발생했습니다.")
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendations()
  }, [user, isChecking])

  // -----------------------------
  // 북마크 추가
  // -----------------------------
  const handleAddBookmark = async (item) => {
    if (!user?.id) {
      setBookmarkMsg("로그인이 필요합니다.")
      return
    }

    try {
      const res = await fetch("${AI_URL}/bookmark/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userid: user.id,
          location: item.title,
          description: item.reason,
        }),
      })

      const data = await res.json()
      setBookmarkMsg(data.message || "북마크가 추가되었습니다.")
      setBookmarked((prev) => [...prev, item.title])

      setTimeout(() => setBookmarkMsg(""), 3000)
    } catch (err) {
      console.error(err)
      setBookmarkMsg("북마크 추가 중 오류가 발생했습니다.")
      setTimeout(() => setBookmarkMsg(""), 3000)
    }
  }

  // -----------------------------
  // 북마크 제거
  // -----------------------------
  const handleRemoveBookmark = async (item) => {
    if (!user?.id) {
      setBookmarkMsg("로그인이 필요합니다.")
      return
    }

    try {
      const res = await fetch("${AI_URL}/bookmark/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userid: user.id,
          location: item.title,
        }),
      })

      const data = await res.json()
      setBookmarkMsg(data.message || "북마크에서 제거되었습니다.")
      setBookmarked((prev) => prev.filter((title) => title !== item.title))

      setTimeout(() => setBookmarkMsg(""), 3000)
    } catch (err) {
      console.error(err)
      setBookmarkMsg("북마크 제거 중 오류가 발생했습니다.")
      setTimeout(() => setBookmarkMsg(""), 3000)
    }
  }

  // -----------------------------
  // Plan 페이지로 이동
  // -----------------------------
  const handleGoToPlan = (item) => {
    navigate("/plan", { state: { destination: item.title } })
  }

  // -----------------------------
  // 렌더링
  // -----------------------------
  return (
    <div className="recommend container">
      <h2 className="recommend-title">맞춤 여행지 추천</h2>

      {!user ? (
        <p className="recommend-sub">
          로그인 후 개인 맞춤 여행 추천을 확인할 수 있습니다 🙂
        </p>
      ) : isChecking ? (
        <p className="recommend-sub">로그인 상태를 확인하는 중입니다...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <>
          {bookmarkMsg && <p className="bookmark-msg">{bookmarkMsg}</p>}
          <div className="recommend-list">
            {recommendations.map((item, index) => (
              <div key={index} className="recommend-card">
                <div className="card-header">
                  <h3>{item.title}</h3>
                </div>

                <div className="card-reason">
                  <strong className="reason-title">추천 이유</strong>
                  <p className="reason-desc">{item.reason}</p>
                </div>

                <div className="card-actions">
                  <button
                    className={`btn ${
                      bookmarked.includes(item.title)
                        ? "btn-danger"
                        : "btn-outline-success"
                    }`}
                    onClick={() =>
                      bookmarked.includes(item.title)
                        ? handleRemoveBookmark(item)
                        : handleAddBookmark(item)
                    }
                  >
                    {bookmarked.includes(item.title)
                      ? "❌ 북마크에서 제거"
                      : "⭐ 북마크에 추가"}
                  </button>

                  <button
                    className="btn btn-success"
                    onClick={() => handleGoToPlan(item)}
                  >
                    🗓 이 여행으로 계획 세우기
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* -----------------------------
          로딩 오버레이
      ----------------------------- */}
      {loading && <Loading />}
    </div>
  )
}

export default Recommend
