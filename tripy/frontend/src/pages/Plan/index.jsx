import { useState } from "react"
import axios from "axios"
import { useContext } from "react"
import { ValueContext } from "../../context/ValueContext"
import { useAuthStore } from "../../store/authStore"

export default function Plan() {
  const { user } = useAuthStore()
  // const [email, setEmail] = useState("")
  // const user_id = user?.id

  const toggleActivity = (item) => {
    setForm((prev) => ({
      ...prev,
      activities: prev.activities.includes(item)
        ? prev.activities.filter((v) => v !== item)
        : [...prev.activities, item],
    }))
  }

  const validateForm = () => {
    if (!form.departure.trim()) return "출발지를 입력해주세요"
    if (!form.destination.trim()) return "목적지를 입력해주세요"
    if (!form.startDate) return "출발 날짜를 선택해주세요"
    if (!form.endDate) return "도착 날짜를 선택해주세요"
    if (!form.people) return "인원을 선택해주세요"

    // 날짜 검증
    if (new Date(form.startDate) > new Date(form.endDate)) {
      return "도착 날짜는 출발 날짜 이후여야 합니다"
    }

    return null //  통과
  }

  // const API_URL = "http://127.0.0.1:8000"
  const handleGeneratePlan = async () => {
    //  1. 폼 검증
    const error = validateForm()
    if (error) {
      alert(error)
      return
    }

    try {
      console.log("=============== ", user.id)
      //  2. POST body로 전송
      const res = await axios.post("/ai/plan", {
        userId: user.id,
        departure: form.departure,
        destination: form.destination,
        startDate: form.startDate,
        endDate: form.endDate,
        people: form.people,
        activities: form.activities, // 배열 그대로 보내는 게 더 좋음
        food: form.food,
        ageGroup: form.ageGroup,
        purpose: form.purpose,
        extra: form.extra,
      })

      console.log("AI 결과:", res.data)
      setAiResult(res.data.result)
    } catch (e) {
      console.error("AI 일정 생성 실패", e)
      alert("AI 일정 생성 중 오류가 발생했습니다")
    }
  }
  const { setValue } = useContext(ValueContext)
  const [form, setForm] = useState({
    departure: "",
    destination: "",
    startDate: "",
    endDate: "",
    people: "",
    activities: [],
    food: "",
    ageGroup: "",
    purpose: "",
    extra: "",
  })

  const [aiResult, setAiResult] = useState("")

  return (
    <>
      <div
        style={{
          minHeight: "100vh",
          background: "#f5f5f5",
          padding: "0 32px",
          paddingTop: "150px",
        }}
      >
        <h1
          style={{ marginBottom: "24px", fontSize: "20px", fontWeight: "600" }}
        >
          Plan Page
        </h1>

        <div style={{ display: "flex", gap: "24px", justifyContent: "center" }}>
          {/* 필수사항 카드 */}
          <div style={cardStyle}>
            <h4 style={{ marginBottom: "20px" }}>
              필수사항<span style={{ color: "red" }}>*</span>
            </h4>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "20px" }}
            >
              {/* 출발지 / 목적지 */}
              <div style={{ display: "flex", gap: "16px" }}>
                <div style={{ flex: 1 }}>
                  <p style={labelStyle}>출발지</p>
                  <input
                    type="text"
                    placeholder="출발지"
                    style={inputStyle}
                    value={form.departure}
                    onChange={(e) =>
                      setForm({ ...form, departure: e.target.value })
                    }
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={labelStyle}>목적지</p>
                  <input
                    type="text"
                    placeholder="목적지"
                    style={inputStyle}
                    value={form.destination}
                    onChange={(e) =>
                      setForm({ ...form, destination: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* 출발 날짜 / 도착 날짜 */}
              <div style={{ display: "flex", gap: "16px" }}>
                <div style={{ flex: 1 }}>
                  <p style={labelStyle}>출발 날짜</p>
                  <input
                    type="date"
                    placeholder="연도-월-일"
                    style={inputStyle}
                    value={form.startDate}
                    onChange={(e) =>
                      setForm({ ...form, startDate: e.target.value })
                    }
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={labelStyle}>도착 날짜</p>
                  <input
                    type="date"
                    placeholder="연도-월-일"
                    style={inputStyle}
                    value={form.endDate}
                    onChange={(e) =>
                      setForm({ ...form, endDate: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* 인원 */}
              <div>
                <p style={labelStyle}>인원</p>
                <select
                  style={{
                    ...selectStyle,
                    color: form.people ? "#333" : "#999",
                  }}
                  value={form.people}
                  onChange={(e) => setForm({ ...form, people: e.target.value })}
                >
                  <option value="">선택해주세요</option>
                  <option value="1">1명</option>
                  <option value="2">2명</option>
                  <option value="3">3명</option>
                  <option value="4">4명</option>
                  <option value="5+">5명 이상</option>
                </select>
              </div>
              <div
                style={{ display: "flex", gap: "16px", alignItems: "flex-end" }}
              >
                <div style={{ flex: 1 }}>
                  <p style={labelStyle}>동행자 초대</p>
                </div>

                <button
                  style={companionButton}
                  onClick={() =>
                    setValue({
                      tripId: 999, // 임시라도 숫자만 있으면 됨
                      tripTitle: form.destination, // 꼭 필요합니다.
                      own: true,
                    })
                  }
                >
                  동행자 검색
                </button>
              </div>
              <div>
                <p style={labelStyle}>선호 활동</p>

                <div style={activityGrid}>
                  {["관광", "맛집", "쇼핑", "자연", "문화", "레저"].map(
                    (item) => {
                      const selected = form.activities.includes(item)

                      return (
                        <button
                          key={item}
                          onClick={() => toggleActivity(item)}
                          style={{
                            ...activityBox,
                            backgroundColor: selected ? "#f5f5f5" : "#fff",
                            border: selected
                              ? "1px solid #88AC73"
                              : "1px solid #ddd",
                          }}
                        >
                          {item}
                        </button>
                      )
                    },
                  )}
                </div>
                <button
                  style={generateButton}
                  onClick={handleGeneratePlan}
                  onMouseOver={(e) => (e.currentTarget.style.opacity = 0.9)}
                  onMouseOut={(e) => (e.currentTarget.style.opacity = 1)}
                >
                  AI 일정 생성
                </button>
              </div>
            </div>
          </div>

          {/* 선택사항 카드 */}
          <div style={cardStyle}>
            <h4 style={{ marginBottom: "20px" }}>선택사항</h4>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "20px" }}
            >
              {/* 음식 선호 */}
              <div style={{ display: "flex", gap: "16px" }}>
                <div style={{ flex: 1 }}>
                  <p style={labelStyle}>음식 선호</p>
                  <input
                    type="text"
                    placeholder="예: 해산물, 채식 등"
                    style={inputStyle}
                    value={form.food}
                    onChange={(e) => setForm({ ...form, food: e.target.value })}
                  />
                </div>
              </div>
              {/* 연령대 */}
              <div>
                <p style={labelStyle}>연령대</p>
                <select
                  style={selectStyle}
                  value={form.ageGroup}
                  onChange={(e) =>
                    setForm({ ...form, ageGroup: e.target.value })
                  }
                >
                  <option value="">선택해주세요</option>
                  <option value="20">20대</option>
                  <option value="30">30대</option>
                  <option value="40">40대</option>
                  <option value="50+">50대 이상</option>
                </select>
              </div>
              {/* 여행 목적 */}
              <div style={{ display: "flex", gap: "16px" }}>
                <div style={{ flex: 1 }}>
                  <p style={labelStyle}>여행 목적</p>
                  <input
                    type="text"
                    placeholder="예: 가족 여행, 신혼 여행 등"
                    style={inputStyle}
                    value={form.purpose}
                    onChange={(e) =>
                      setForm({ ...form, purpose: e.target.value })
                    }
                  />
                </div>
              </div>
              {/* 추가 요구사항 */}
              <div style={{ display: "flex", gap: "16px" }}>
                <div style={{ flex: 1 }}>
                  <p style={labelStyle}>추가 요구사항</p>
                  <textarea
                    placeholder={`특별히 고려해야 할 사항이나 원하는 활동을 
자유롭게 입력해주세요`}
                    style={writeStyle}
                    value={form.extra}
                    onChange={(e) =>
                      setForm({ ...form, extra: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {/* AI일정 카드 */}
          <div style={cardStyle}>
            <h4>생성된 AI일정</h4>

            {aiResult ? (
              // ✅ AI 결과 있을 때
              <div
                style={{
                  whiteSpace: "pre-line",
                  fontSize: "14px",
                  lineHeight: "1.7",
                  color: "#333",
                  overflowY: "auto", // ⭐ 스크롤
                  flex: 1,
                }}
              >
                {aiResult}
              </div>
            ) : (
              // ✅ 처음 상태 (안내 문구)
              <div
                style={{
                  flex: 1,
                  height: "100%",
                  minHeight: "360px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                  color: "#888",
                  fontSize: "13px",
                  lineHeight: "1.6",
                }}
              >
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "50%",
                    background: "#eee",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "16px",
                  }}
                >
                  📅
                </div>
                <p>왼쪽 폼에서 정보를 입력하고</p>
                <p>AI 일정 생성 버튼을 눌러주세요</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

/* ===== styles ===== */

const cardStyle = {
  background: "#fff",
  height: "680px",
  borderRadius: "8px",
  padding: "24px",
  width: "28%",
  boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
}

const labelStyle = {
  marginBottom: "6px",
  fontSize: "14px",
}

const inputStyle = {
  width: "100%",
  height: "40px",
  border: "1px solid #ddd",
  borderRadius: "6px",
  padding: "0 12px",
}

const writeStyle = {
  width: "100%",
  height: "300px",
  border: "1px solid #ddd",
  borderRadius: "6px",
  padding: "12px",
  paddingTop: "130px",
}

const selectStyle = {
  height: "40px",
  width: "100%",
  borderRadius: "6px",
  border: "1px solid #ddd",
  padding: "0 12px",
}

const activityGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "12px",
}

const activityBox = {
  height: "40px",
  borderRadius: "6px",
  fontSize: "14px",
  cursor: "pointer",
}

const generateButton = {
  width: "100%",
  height: "48px",
  borderRadius: "8px",
  backgroundColor: "#88AC73",
  color: "#fff",
  fontSize: "15px",
  fontWeight: "600",
  border: "none",
  cursor: "pointer",
  marginTop: "20px",
}

const companionButton = {
  width: "49%",
  height: "40px",
  borderRadius: "8px",
  background: "transparent",
  border: "1px solid #88AC73",
  color: "#88AC73",
  fontSize: "14px",
  fontWeight: "600",
  cursor: "pointer",
}
