import React, { useState, useEffect } from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL || "/api";
const Album = () => {
  // photos 상태(state)를 사용
  const [photos, setPhotos] = useState([]);
  // 현재 어떤 탭이 선택되었는지 저장하는 상태 (기본값: '전체')
  const [activeTab, setActiveTab] = useState("전체");
  // 폴더를 클릭했을 때 어떤 폴더를 보고 있는지 저장 (null이면 폴더 목록 보여줌)
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthError, setIsAuthError] = useState(false);
  const [isError, setIsError] = useState(false);

  // 컴포넌트 실행 시 데이터 가져오기
  useEffect(() => {
    // 1. 요청 취소를 위한 컨트롤러 생성
    const controller = new AbortController();

    const fetchPhotos = async () => {
      try {
        const res = await axios.get(`${API_URL}/album`, {
          withCredentials: true,
          signal: controller.signal, // 2. axios에 시그널 연결
        });
        console.log("가져온 사진 데이터:", res.data);
        setPhotos(res.data);
      } catch (err) {
        // 요청 취소인 경우 무시
        if (axios.isCancel(err)) return;

        // 401 에러(로그인 필요) 체크
        if (err.response && err.response.status === 401) {
          console.log("로그인이 필요합니다.");
          setIsAuthError(true);
        }
        // 404 에러(데이터 없음)는 에러가 아니라 '빈 목록'으로 처리
        if (err.response && err.response.status === 404) {
          console.log("데이터가 없습니다 (404). 빈 목록으로 초기화합니다.");
          setPhotos([]); // 빈 배열로 설정
          setIsError(false); // 에러 아님
        } else {
          // 진짜 에러(500 서버 오류, 네트워크 오류 등)인 경우만 에러 처리
          console.error("사진 로드 실패:", err);
          // alert("사진 로드 실패")
          setIsError(true); // 에러 상태를 true로 변경
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchPhotos();

    // 4. 클린업 함수: 컴포넌트가 다시 렌더링되거나 사라질 때 이전 요청 취소
    return () => {
      controller.abort();
    };
  }, []); // 빈 배열 --> 처음 한 번만 실행

  // 탭이 바뀌면 선택된 폴더 초기화 (폴더 목록으로 돌아가기)
  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    setSelectedFolder(null);
  };

  const styles = {
    container: {
      maxWidth: "1000px",
      margin: "0 auto",
      padding: "20px",
      fontFamily: "'Noto Sans KR', sans-serif",
    },
    header: {
      marginBottom: "40px",
    },
    title: {
      fontSize: "1.5rem",
      fontWeight: "700",
      color: "#111827",
      marginBottom: "10px",
    },
    description: {
      color: "#6b7280",
      marginBottom: "30px",
    },
    buttonGroup: {
      display: "flex",
      gap: "10px",
    },
    // 1. 기본 버튼 스타일 (평소 상태)
    btn: {
      padding: "10px 20px",
      borderRadius: "0.5rem",
      border: "1px solid #e5e7eb",
      backgroundColor: "white",
      color: "#374151",
      fontSize: "1rem",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.2s",
    },
    // 2. 활성화된 버튼 스타일 (선택된 상태)
    activeBtn: {
      padding: "10px 20px",
      borderRadius: "0.5rem",
      border: "1px solid #1f2937",
      backgroundColor: "#1f2937",
      color: "white",
      fontSize: "1rem",
      fontWeight: "700",
      cursor: "pointer",
      transition: "all 0.2s",
    },
    // 3. 사진 그리드 (전체 탭용: 가로 6개)
    photoGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(6, 1fr)", // 한 줄에 6개
      gap: "10px",
    },
    photoItem: {
      aspectRatio: "1/1", // 정사각 비율 유지
      backgroundColor: "#eee",
      borderRadius: "8px",
      overflow: "hidden",
      position: "relative",
    },
    photoImg: { width: "100%", height: "100%", objectFit: "cover" },

    // 4. 폴더 그리드 (날짜/위치/카테고리용: 가로 4개)
    folderGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: "20px",
    },
    folderItem: {
      border: "1px solid #e5e7eb",
      borderRadius: "12px",
      padding: "20px",
      textAlign: "center",
      cursor: "pointer",
      backgroundColor: "#f9fafb",
      transition: "background 0.2s",
    },
    folderIcon: { fontSize: "50px", marginBottom: "10px" },
    folderTitle: { fontWeight: "bold", fontSize: "1.0rem" },
    folderCount: { color: "#6b7280", fontSize: "0.9rem" },

    // 뒤로가기 버튼 영역
    backArea: {
      marginBottom: "20px",
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },
    backBtn: {
      cursor: "pointer",
      border: "none",
      background: "none",
      fontSize: "1.2rem",
      fontWeight: "bold",
    },
  };

  // 탭 목록 데이터
  const tabs = ["전체", "날짜", "위치", "카테고리"];

  // ====================

  // 로직 구현

  // ====================

  // 1. 현재 탭 기준 데이터 그룹화 함수
  const getGroupedData = () => {
    // 키(key) 결정: 날짜 or 위치 or 카테고리
    let key = "";
    if (activeTab === "날짜") key = "date";
    else if (activeTab === "위치") key = "location";
    else if (activeTab === "카테고리") key = "category";

    // 해당 키로 그룹핑 (예: { "서울": [사진1, 사진2], "부산": [사진3] })
    const groups = {};
    photos.forEach((photo) => {
      const value = photo[key] || "미분류"; // null 방지
      if (!groups[value]) groups[value] = [];
      groups[value].push(photo);
    });
    return groups;
  };

  // 2. 화면 렌더링 결정 로직
  const renderContent = () => {
    if (isLoading)
      return (
        <p style={{ textAlign: "center", marginTop: "50px" }}>
          사진 불러오는 중...
        </p>
      );

    if (isAuthError) {
      return (
        <div style={styles.loginWarning}>
          <p style={{ textAlign: "center", marginTop: "50px" }}>
            로그인이 필요한 서비스입니다.
          </p>
        </div>
      );
    }

    if (isError) {
      return (
        <p style={{ textAlign: "center", marginTop: "50px", color: "red" }}>
          사진을 불러오지 못했습니다.
        </p>
      );
    }

    if (photos.length === 0)
      return (
        <p style={{ textAlign: "center", marginTop: "50px" }}>
          아직 업로드된 사진이 없습니다.
        </p>
      );

    // CASE A: '전체' 탭일 때 -> 무조건 모든 사진 보여줌
    if (activeTab === "전체") {
      console.log("photos", photos);
      return (
        <div style={styles.photoGrid}>
          {photos.map((photo) => (
            <div key={photo.id} style={styles.photoItem}>
              <img src={photo.url} alt="" style={styles.photoImg} />
            </div>
          ))}
        </div>
      );
    }

    // CASE B: '날짜/위치/카테고리' 탭인데, 아직 폴더를 안 눌렀을 때 -> 폴더 목록 보여줌
    if (selectedFolder === null) {
      const groupedData = getGroupedData(); // 그룹 데이터 가져오기
      const groupKeys = Object.keys(groupedData); // ["서울", "부산", "제주"] 등

      // 데이터가 하나도 없으면 안내 문구
      if (groupKeys.length === 0) return <p>분류된 결과가 없습니다.</p>;
      return (
        <div style={styles.folderGrid}>
          {groupKeys.map((groupName) => (
            <div
              key={groupName}
              style={styles.folderItem}
              onClick={() => setSelectedFolder(groupName)} // 클릭하면 해당 폴더 진입
            >
              <div style={styles.folderIcon}>📁</div>
              <div style={styles.folderTitle}>{groupName}</div>
              {/* <div style={styles.folderCount}>
                {groupedData[groupName].length}장
              </div> */}
            </div>
          ))}
        </div>
      );
    }

    // CASE C: 폴더를 눌러서 상세 보기 중일 때 -> 해당 폴더의 사진들 보여줌
    const filteredPhotos = photos.filter((p) => {
      if (activeTab === "날짜") return p.date === selectedFolder;
      if (activeTab === "위치") return p.location === selectedFolder;
      if (activeTab === "카테고리") return p.category === selectedFolder;
      return false;
    });

    return (
      <div>
        {/* 뒤로가기 바 */}
        <div style={styles.backArea}>
          <button
            style={styles.backBtn}
            onClick={() => setSelectedFolder(null)}
          >
            🡸
          </button>
          <span>
            <strong>{activeTab}</strong> {">"} {selectedFolder}
          </span>
        </div>

        {/* 사진 그리드 (전체 탭과 동일한 스타일 사용) */}
        <div style={styles.photoGrid}>
          {filteredPhotos.map((photo) => (
            <div key={photo.id} style={styles.photoItem}>
              <img src={photo.url} alt="" style={styles.photoImg} />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      {/* [추가] 헤더 높이만큼 공간을 차지하는 빈 div */}
      <div style={{ height: "200px", width: "100%" }}></div>

      <header style={styles.header}>
        <h1 style={styles.title}>스마트 앨범</h1>
        <p style={styles.description}>AI가 분류한 사진을 확인하세요</p>
        <div style={styles.buttonGroup}>
          {tabs.map((tabName) => (
            <button
              key={tabName}
              onClick={() => handleTabChange(tabName)}
              style={activeTab === tabName ? styles.activeBtn : styles.btn}
            >
              {tabName}
            </button>
          ))}
        </div>
      </header>

      {/* 실제 내용 렌더링 */}
      {renderContent()}
    </div>
  );
};

export default Album;
