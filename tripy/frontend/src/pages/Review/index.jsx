import axios from "axios"
import { useEffect, useState, useContext } from "react"
import PageNation from "../../components/common/pagination/PagiNation"
import { useNavigate } from "react-router-dom"
import SendMessage from "../../components/modals/SendMessage"
import Loading from "../../components/Loading"
import { useAuthStore } from "../../store/authStore"
import { Reset } from "../../context/ValueContext"
import { ValueContext } from "../../context/ValueContext"
const API_URL = import.meta.env.VITE_API_URL || "/api"
// 오타 수정: widthCredentials -> withCredentials
const instance = axios.create({
  withCredentials: true,
})
const Review = () => {
  const { user } = useAuthStore()
  const { setValue } = useContext(ValueContext)
  const { reset } = useContext(Reset)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const formatDate = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return `${date.getFullYear()}년 ${
      date.getMonth() + 1
    }월 ${date.getDate()}일`
  }

  const fetchPosts = async () => {
    try {
      setLoading(true)
      // 백엔드 경로에 맞게 호출 (api/review)
      const res = await instance.get(`${API_URL}/review`)
      console.log(res.data)
      setPosts(res.data)
    } catch (e) {
      console.error("데이터 로딩 실패:", e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchPosts()
    } else {
      setPosts([]) // 로그아웃 되면 게시글 목록 초기화
    }
  }, [user])

  useEffect(() => {
    fetchPosts()
  }, [reset])
  const inviteMember = (tripId, tripTitle) => {
    setValue({ tripId, tripTitle, own: true })
  }
  const withdrawMember = (tripId, tripTitle) => {
    setValue({ tripId, tripTitle, own: false })
  }
  // ★ 스타일 객체 (제공해주신 디자인 적용)
  const styles = {
    container: {
      maxWidth: "1152px",
      margin: "150px auto 2.5rem auto",
      padding: "2rem",
      fontFamily: "'Noto Sans KR', sans-serif",
      minHeight: "500px",
      // background: "yellow",
    },
    header: {
      marginBottom: "2.5rem",
      marginTop: "150px",
    },
    sectionTitle: {
      fontSize: "1.125rem",
      fontWeight: "700",
      marginBottom: "1rem",
      marginTop: "2.5rem",
      color: "#111827",
    },
    tripList: {
      display: "flex",
      flexDirection: "column",
      gap: "0.75rem",
    },
    tripItem: {
      backgroundColor: "white",
      padding: "1rem",
      borderRadius: "0.75rem",
      border: "1px solid #f3f4f6",
      boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      cursor: "pointer",
      transition: "transform 0.2s",
    },
    tripInfo: {
      display: "flex",
      alignItems: "center",
      gap: "1rem",
    },
    tripThumb: {
      width: "4rem",
      height: "4rem",
      borderRadius: "0.5rem",
      overflow: "hidden",
      backgroundColor: "#f3f4f6",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    img: {
      width: "80%",
      height: "80%",
      objectFit: "contain",
    },
    tripTitle: {
      margin: 0,
      fontSize: "1rem",
      fontWeight: "700",
      color: "#1f2937",
    },
    tripDate: {
      margin: "0.25rem 0 0 0",
      fontSize: "0.875rem",
      color: "#6b7280",
    },
    empty: {
      textAlign: "center",
      padding: "3rem",
      color: "#9ca3af",
      backgroundColor: "#f9fafb",
      borderRadius: "0.75rem",
      listStyle: "none",
    },
  }
  return (
    <div style={styles.container}>
      <section>
        <h2 style={styles.sectionTitle}>최근 일정</h2>
        <div style={styles.tripList}>
          {/* 데이터가 없을 때 */}
          {posts.length === 0 && !loading && (
            <li style={styles.empty}>
              아직 게시글이 없습니다. 첫 글을 작성해보세요!
            </li>
          )}

          {/* 데이터 렌더링 (DB 컬럼명에 맞춰 수정) */}
          {posts.map((post) => (
            <div
              key={post.id}
              style={styles.tripItem}
              onClick={() => {
                navigate(`/review/${post.id}`)
              }}
            >
              <div style={styles.tripInfo}>
                <div style={styles.tripThumb}>
                  {/* 로고 이미지가 있다면 넣고, 없으면 기본 이미지 */}
                  <img
                    src="/assets/img/tripy.png"
                    alt="logo"
                    style={styles.img}
                  />
                </div>
                <div>
                  <h3 style={styles.tripTitle}>{post.title}</h3>
                  <p style={styles.tripDate}>
                    {
                      post.start_date && post.end_date
                        ? `${formatDate(post.start_date)} ~ ${formatDate(
                            post.end_date,
                          )}`
                        : new Date(post.createdAt).toLocaleDateString("ko-KR") // 날짜 데이터가 없을 때 기본값
                    }
                  </p>
                </div>
              </div>

              <div style={{ marginLeft: "auto" }}>
                {post.owner === 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      inviteMember(post.id, post.title)
                    }}
                  >
                    멤버초대
                  </button>
                )}

                {post.owner === 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      withdrawMember(post.id, post.title)
                    }}
                  >
                    멤버탈퇴
                  </button>
                )}
              </div>
              {/* <SendMessage tripId={post.id} tripTitle={post.title} /> */}
              <i
                className="fa-solid fa-chevron-right"
                style={{ color: "#d1d5db" }}
              ></i>
            </div>
          ))}
        </div>
      </section>

      {/* 로딩 중일 때 표시 */}
      {loading && <Loading />}

      <div style={{ marginTop: "2rem" }}>
        <PageNation />
      </div>
    </div>
  )
}
export default Review
