// import "./Main.css"
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageNation from "../../components/common/pagination/PagiNation";
import { useAuthStore } from "../../store/authStore";

const API_URL = import.meta.env.VITE_API_URL || "/api";

const instance = axios.create({
  withCredentials: true,
});

const Main = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tripCounts, setTripCounts] = useState({
    upcoming: 0,
    ongoing: 0,
    completed: 0,
  });

  const navigate = useNavigate();
  const { user } = useAuthStore();

  // 페이지 이동 함수
  const goToPlan = () => navigate("/plan");
  const goToAlbum = () => navigate("/album");

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return `${date.getFullYear()}년 ${
      date.getMonth() + 1
    }월 ${date.getDate()}일`;
  };

  const fetchMainData = async () => {
    try {
      setLoading(true);
      const res = await instance.get(`${API_URL}/main`);
      if (res.data.posts) {
        setPosts(res.data.posts);
      }
      if (res.data.tripCount) {
        setTripCounts(res.data.tripCount);
      }
    } catch (e) {
      console.error("데이터 로딩 실패:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMainData();
    } else {
      setTripCounts({ upcoming: 0, ongoing: 0, completed: 0 });
      setPosts([]);
    }
  }, [user]);

  // --- 스타일 객체 (가독성을 위해 핵심 로직 아래 배치했습니다) ---
  const styles = {
    container: {
      maxWidth: "1152px",
      margin: "0 auto",
      padding: "2rem",
      fontFamily: "'Noto Sans KR', sans-serif",
      color: "#1f2937",
      boxSizing: "border-box",
      paddingTop: "80px",
    },
    header: { marginBottom: "2.5rem", marginTop: "150px" },
    title: {
      fontSize: "1.5rem",
      fontWeight: "700",
      color: "#111827",
      marginBottom: "0.25rem",
    },
    description: { color: "#6b7280", marginBottom: "1.5rem" },
    buttonGroup: { display: "flex", gap: "0.75rem" },
    btn: {
      padding: "0.625rem 1.25rem",
      borderRadius: "0.5rem",
      fontWeight: "500",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      fontSize: "1rem",
      border: "none",
    },
    btnPrimary: { backgroundColor: "#8CBF68", color: "white" },
    btnSecondary: {
      backgroundColor: "white",
      border: "1px solid #d1d5db",
      color: "#374151",
    },
    sectionTitle: {
      fontSize: "1.125rem",
      fontWeight: "700",
      marginBottom: "1rem",
      marginTop: "2.5rem",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "1.5rem",
    },

    // 카드 스타일
    card: {
      backgroundColor: "white",
      padding: "1.5rem",
      borderRadius: "0.75rem",
      border: "1px solid #f3f4f6",
      boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
      height: "8rem",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    },
    cardTop: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    iconBox: { display: "flex", alignItems: "center", gap: "0.75rem" },
    iconCircle: {
      width: "2.5rem",
      height: "2.5rem",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    // 리스트 스타일
    tripList: { display: "flex", flexDirection: "column", gap: "0.75rem" },
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
    },
    tripInfo: { display: "flex", alignItems: "center", gap: "1rem" },
    tripThumb: {
      width: "4rem",
      height: "4rem",
      borderRadius: "0.5rem",
      overflow: "hidden",
      backgroundColor: "#e5e7eb",
    },
    img: { width: "100%", height: "100%", objectFit: "cover" },
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
      listStyle: "none",
      padding: "1rem",
      textAlign: "center",
      color: "#6b7280",
    },

    // 유틸리티 스타일
    themes: {
      green: {
        text: { color: "#8CBF68" },
        bg: { backgroundColor: "#f0fdf4", color: "#8CBF68" },
      },
      orange: {
        text: { color: "#fb923c" },
        bg: { backgroundColor: "#fff7ed", color: "#fb923c" },
      },
    },
  };

  // ★ [최적화 핵심] 카드 데이터 배열 정의
  // 화면에 그릴 카드들의 정보를 배열로 관리합니다.
  const cardData = [
    {
      id: "ongoing",
      title: "진행 중인 여행",
      count: tripCounts.ongoing,
      desc: "현재 진행 중인 여행이 있습니다.",
      icon: "fa-solid fa-plane",
      theme: "green", // styles.themes.green 사용
    },
    {
      id: "upcoming",
      title: "다가오는 일정",
      count: tripCounts.upcoming,
      desc: "곧 시작할 여행이 있습니다.",
      icon: "fa-regular fa-bell",
      theme: "orange", // styles.themes.orange 사용
    },
    {
      id: "completed",
      title: "완료된 여행",
      count: tripCounts.completed,
      desc: "완료된 여행",
      icon: "fa-solid fa-check", // 아이콘 통일감을 위해 변경 (원하면 fa-plane 유지 가능)
      theme: "green",
    },
  ];

  return (
    <div style={styles.container}>
      {/* 1. 헤더 */}
      <header style={styles.header}>
        <h1 style={styles.title}>
          {user ? `${user.nickname}님 환영합니다!` : "환영합니다!"}
        </h1>
        <p style={styles.description}>오늘 어떤 여행을 계획해 볼까요?</p>
        <div style={styles.buttonGroup}>
          <button
            style={{ ...styles.btn, ...styles.btnPrimary }}
            onClick={goToPlan}
          >
            <i className="fa-solid fa-plus"></i> 새 여행 만들기
          </button>
          <button
            style={{ ...styles.btn, ...styles.btnSecondary }}
            onClick={goToAlbum}
          >
            <i className="fa-regular fa-image"></i> 앨범 이동
          </button>
        </div>
      </header>

      {/* 2. 여행 요약 (카드) - 최적화된 부분 */}
      <section>
        <h2 style={styles.sectionTitle}>여행 요약</h2>
        <div style={styles.grid}>
          {cardData.map((card) => {
            const themeStyle = styles.themes[card.theme]; // green or orange 스타일 가져오기

            return (
              <div key={card.id} style={styles.card}>
                <div style={styles.cardTop}>
                  <div style={styles.iconBox}>
                    <div style={{ ...styles.iconCircle, ...themeStyle.bg }}>
                      <i className={card.icon}></i>
                    </div>
                    <span style={{ fontWeight: 500, color: "#4b5563" }}>
                      {card.title}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: 700,
                      ...themeStyle.text,
                    }}
                  >
                    {card.count}
                  </span>
                </div>
                <p
                  style={{ fontSize: "0.875rem", color: "#9ca3af", margin: 0 }}
                >
                  {card.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. 최근 일정 리스트 */}
      <section>
        <h2 style={styles.sectionTitle}>최근 일정</h2>
        <div style={styles.tripList}>
          {posts.length === 0 && !loading && (
            <div style={styles.empty}>
              아직 게시글이 없습니다. 첫 글을 작성해보세요!
            </div>
          )}

          {posts.map((post) => (
            <div
              key={post.id}
              style={styles.tripItem}
              onClick={() => navigate(`/review/${post.id}`)}
            >
              <div style={styles.tripInfo}>
                <div style={styles.tripThumb}>
                  <img
                    src="/assets/img/tripy.png"
                    alt="logo"
                    style={styles.img}
                  />
                </div>
                <div>
                  <h3 style={styles.tripTitle}>{post.title}</h3>
                  <p style={styles.tripDate}>
                    {post.start_date && post.end_date
                      ? `${formatDate(post.start_date)} ~ ${formatDate(
                          post.end_date,
                        )}`
                      : new Date(post.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <i
                className="fa-solid fa-chevron-right"
                style={{ color: "#d1d5db" }}
              ></i>
            </div>
          ))}
        </div>
      </section>

      {loading && (
        <p style={{ textAlign: "center", marginTop: "1rem" }}>로딩 중...</p>
      )}

      {/* <div style={{ marginTop: "2rem" }}>
        <PageNation />
      </div> */}
    </div>
  );
};

export default Main;
