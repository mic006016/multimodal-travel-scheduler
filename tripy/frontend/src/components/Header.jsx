import { useState, useEffect, useRef, useContext } from "react";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import Login from "./auth/Login";
import Join from "./auth/Join";
import Navigation from "./nav/MainNav";
import MessageModal from "./modals/MessageModal";
import SendMessage from "./modals/SendMessage";
import SetClose from "./modals/SetClose";
import { Pages } from "../context/ValueContext";
import socket from "../socket";

// import Loading from "./Loading";

function Header() {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const navigate = useNavigate();
  const { setPage } = useContext(Pages);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        // 스크롤 내릴 때 (Down)
        setIsVisible(false);
      } else {
        // 스크롤 올릴 때 (Up)
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll);

    // 컴포넌트 언마운트 시 이벤트 제거 (메모리 누수 방지)
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Zustand에서 상태와 액션 가져오기
  const {
    user,
    login: authLogin,
    join: authJoin,
    logout,
    loading,
    error,
  } = useAuthStore();

  // 로컬 상태 (폼 입력용)
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [errMessage, setErrMessage] = useState(true);
  const [select, setSelect] = useState(true);

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await authLogin(email, password);

    if (result?.success) {
      setNickname("");
      setEmail("");
      setPassword("");
      // console.log("소켓 연결됨.");
      navigate("/main");
      setPage("Main");
      // fetchPosts();
    }
    if (user) {
      socket.connect();
    }
  };

  const handleJoin = async () => {
    await authJoin(nickname, email, password);
  };
  const handleLogout = () => {
    logout();
    socket.disconnect();
    navigate("/main");
    setPage("Main");
    // logoutList();
  };

  return (
    <div className={`header ${!isVisible ? "hidden" : ""}`}>
      <div className="container header-content">
        <div className="header-left">
          <img className="logo" src="/assets/img/tripy.png" width="200px" />
          <Navigation />
        </div>

        <div className="header-right">
          <div>
            {select ? (
              <Login
                user={user}
                handleLogin={handleLogin}
                handleLogout={handleLogout}
                loading={loading}
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
              />
            ) : (
              <Join
                handleJoin={handleJoin}
                loading={loading}
                nickname={nickname}
                setNickname={setNickname}
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
              />
            )}
          </div>
          <div
            className="authSelector"
            onClick={() => setSelect(!select)}
            //style={{ color: "white" }}
          >
            {user ? "" : select ? "회원가입" : "로그인"}
          </div>
          {error && <p className="login-error">{error}</p>}
          {user && <SetClose userId={user.id} />}
        </div>
        <MessageModal />
        <SendMessage />
      </div>
      {/* {loading && <Loading />} */}
    </div>
  );
}

export default Header;
