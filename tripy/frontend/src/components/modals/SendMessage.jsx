import { useState, useEffect, useContext } from "react";
import socket from "../../socket";
import { ValueContext } from "../../context/ValueContext";
import axios from "axios";
import { Reset } from "../../context/ValueContext";
import { useAuthStore } from "../../store/authStore";
const API_URL = import.meta.env.VITE_API_URL || "/api";
export default function SendMessage() {
  const [toUserEmail, setToUserEmail] = useState("");
  const [users, setUsers] = useState([]);
  const [text, setText] = useState("");
  const [sendMails, setSendMails] = useState([]);
  const { user } = useAuthStore(); // 검색이 허용된  user들 가져오기
  const [visible, setVisible] = useState(false);
  const { value } = useContext(ValueContext);
  const { setReset } = useContext(Reset);

  useEffect(() => {
    // delivery_status 이벤트는 컴포넌트가 마운트될 때 한 번만 등록
    socket.on("delivery_status", (status) => {
      if (status.ok) {
        alert("메시지 전송 성공!");
      } else {
        alert("전송 실패: " + status.reason);
      }
    });

    return () => {
      socket.off("delivery_status"); // 언마운트 시 정리
    };
  }, []);
  const getUsers = async () => {
    try {
      const users = await axios.get(`${API_URL}/companion/getUsers`);
      console.log(users.data.users);
      setUsers(users.data.users);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (value.tripId) {
      // 메시지가 생기면 모달을 먼저 렌더링하고
      // 다음 tick에서 show 클래스를 붙여 transition 실행
      getUsers();
      setVisible(true);
    } else {
      setVisible(false);
    }
    // setValue({ tripId: 0, tripTitle: "", own: true });
  }, [value]);

  const sendMessage = () => {
    const requests = sendMails.map(
      (email) =>
        new Promise((resolve, reject) => {
          socket.emit(
            "send_to_user",
            {
              toUserEmail: email,
              tripId: value.tripId,
              tripTitle: value.tripTitle,
              text,
            },
            (response) => {
              // 서버에서 ack 콜백을 보내줄 때 실행됨
              if (response.success) {
                resolve(response);
              } else {
                reject(response.error);
              }
            },
          );
        }),
    );

    Promise.all(requests)
      .then((responses) => {
        responses.forEach((res) => console.log(res));
      })
      .catch((e) => {
        console.error("하나라도 실패하면 여기로 옵니다:", e);
      });
  };

  const withdraw = async () => {
    console.log("user", user.id);
    try {
      const res = await axios.post(`${API_URL}/companion/withdraw`, {
        tripId: value.tripId,
        userId: user.id,
      });

      setReset(res.data); //Review화면 갱신
      console.log("res.data", res.data);
    } catch (e) {
      console.error(e);
    }
  };
  const closeForm = () => {
    setVisible(false);
  };
  return (
    <div className={`sendMessage ${visible ? "show" : ""}`}>
      <h4 style={{ fontSize: "1.2rem" }}>
        <b>
          {/* {value.tripId} */}
          {value.tripTitle}
        </b>
        <span> </span>
        {value.own ? "동행 요청" : "동행 취소"}
      </h4>
      {value.own && (
        <div style={{ borderBottom: "3px solid white", paddingBottom: "1rem" }}>
          <input
            style={{
              padding: "5px",
              borderRadius: "8px",
              border: "none",
              paddingLeft: ".7rem",
            }}
            placeholder="받는 유저 Email"
            value={toUserEmail}
            onChange={(e) => setToUserEmail(e.target.value)}
          />
          <button
            style={{ marginLeft: "2rem" }}
            onClick={() => {
              // getUserByEmail();
              // alert(toUserEmail);
              // console.log("users", ...users);
              setUsers([{ email: toUserEmail }, ...users]);
              setToUserEmail("");
            }}
          >
            추가
          </button>
        </div>
      )}
      {value.own ? (
        Array.isArray(users) &&
        users.map(
          (member, index) =>
            member.id !== user.id && (
              <div
                key={index} // map 사용 시 key 필수
                className="inputs"
                style={{
                  // minHeight: "200px",
                  width: "100%",
                  marginTop: "1rem",
                }}
              >
                <input
                  style={{
                    padding: "5px",
                    borderRadius: "8px",
                    border: "none",
                    paddingLeft: ".7rem",
                  }}
                  placeholder="받는 유저 Email"
                  value={member.email}
                  onChange={(e) => setToUserEmail(e.target.value)}
                />
                <label>
                  <input
                    type="checkbox"
                    style={{ margin: "10px" }}
                    onClick={() => setSendMails([member.email, ...sendMails])}
                  />
                  확인
                  {/* 확인/체크하면 배열에 넣고 보내기하면 promise.all사용 해 볼 것 */}
                </label>
              </div>
            ),
        )
      ) : (
        <div
          className="inputs"
          style={{
            // minHeight: "20px",
            width: "100%",
          }}
        >
          {/* 동행 취소일 때 보여줄 UI */}
        </div>
      )}

      <div
        className="button"
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "8px",
          marginTop: "2rem",
        }}
      >
        {value.own ? (
          <button onClick={sendMessage}>보내기</button>
        ) : (
          <button onClick={() => withdraw()}>확인</button>
        )}
        <button onClick={closeForm}>닫기</button>
      </div>
    </div>
  );
}
