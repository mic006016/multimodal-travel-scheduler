/* eslint-disable no-unused-vars */
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthStore } from "./store/authStore";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Chatbot from "./components/Chatbot";
import Main from "./pages/Main";
import Plan from "./pages/Plan";
import Recommend from "./pages/Recommend";
import Album from "./pages/Album";
import Theme from "./pages/Theme";
import Review from "./pages/Review";
import Loading from "./components/Loading";
import AI from "./pages/AI";
import Temp from "./pages/Temp";
import ReviewDetail from "./pages/Review/ReviewDetail"; // 리뷰상세 페이지 컴포넌트
import Rag from "./pages/Rag";
import "./App.css";
import { ValueContext } from "./context/ValueContext";
import { Reset } from "./context/ValueContext";
import { Pages } from "./context/ValueContext";
import socket from "./socket";
function App() {
  const { user, isChecking, checkAuth } = useAuthStore();

  const [value, setValue] = useState({
    tripId: null,
    tripTitle: null,
    own: false,
  });
  const [reset, setReset] = useState(false);
  const [page, setPage] = useState("Main");
  useEffect(() => {
    if (socket.id) return;
    socket.connect();
    socket.on("connect", () => {
      console.log("✅ 새로고침 후 재연결 성공:", socket.id);
    });
  }, []);
  useEffect(() => {
    // 새로고침 하자마자 서버에 세션 유효성 확인
    checkAuth();
  }, []);
  if (isChecking) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          opcity: 0.2,
        }}
      >
        {/* <p>로그인 상태를 확인하고 있습니다...</p> */}
        <Loading />
      </div>
    );
  }
  return (
    <BrowserRouter>
      <div className="App">
        <ValueContext.Provider value={{ value, setValue }}>
          <Reset.Provider value={{ reset, setReset }}>
            <Pages.Provider value={{ page, setPage }}>
              <Header />
              <main>
                <Routes>
                  <Route path="/" element={<Main />} />
                  <Route path="/main" element={<Main />} />
                  <Route path="/plan" element={<Plan />} />
                  <Route path="/recommend" element={<Recommend />} />
                  <Route path="/album" element={<Album />} />
                  <Route path="/theme" element={<Theme />} />
                  <Route path="/review" element={<Review />} />
                  <Route path="/review/:id" element={<ReviewDetail />} />
                  <Route path="/ai" element={<AI />} />
                  <Route path="/temp" element={<Temp />} />
                  <Route path="/rag" element={<Rag />} />
                  <Route path="/chatbot" element={<Chatbot />} />
                </Routes>
              </main>
            </Pages.Provider>
          </Reset.Provider>
        </ValueContext.Provider>
        <Chatbot />
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
