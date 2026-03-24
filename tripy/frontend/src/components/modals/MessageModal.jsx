import { useEffect, useState, useContext } from "react"
import { useMessageStore } from "../../store/messageStore"
import { useAuthStore } from "../../store/authStore"
import styles from "./MessageModal.module.scss"
import { Reset } from "../../context/ValueContext"
import axios from "axios"
const API_URL = import.meta.env.VITE_API_URL || "/api"
const MessageModal = () => {
  const { user } = useAuthStore()
  const { nextMessage, messages, latestMessage, clearLatest } =
    useMessageStore()
  const [visible, setVisible] = useState(false)
  const { setReset } = useContext(Reset)

  useEffect(() => {
    if (latestMessage) {
      // 메시지가 생기면 모달을 먼저 렌더링하고
      // 다음 tick에서 show 클래스를 붙여 transition 실행
      setVisible(true)
    } else {
      setVisible(false)
    }
  }, [messages])

  if (!latestMessage) return null

  const confirm = async () => {
    try {
      const res = await axios.post(`${API_URL}/companion`, {
        tripId: latestMessage.tripId,
        userId: user.id,
      })
      nextMessage()
      setReset(res.data) //Review화면 갱신
      console.log("res.data", res.data, "messages", messages)
    } catch (e) {
      console.error(e)
    }
  }

  const hold = () => {
    nextMessage()
  }

  return (
    <div className={`messageModal ${visible ? "show" : ""}`}>
      <div className={styles.backdrop}>
        <div className={styles.modal}>
          <h3>새 메세지 도착</h3>
          <p>
            <b>보낸사람:</b> {latestMessage.fromUserEmail}
          </p>
          <p>{latestMessage.tripTitle}</p>
          <div
            className="button"
            style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}
          >
            <button onClick={confirm}>수락</button>
            <button onClick={hold}>보류</button>
          </div>
        </div>
      </div>
      <div
        style={{
          width: "50px",
          height: "50px",
          position: "absolute",
          right: 0,
          top: 0,
          borderRadius: "50%",
          background: "green",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          // lineHeight: 2,
        }}
      >
        <div
          style={{
            position: "absolute",
            fontWeight: "bold",
            fontSize: "3rem",
            color: "tomato",
          }}
        >
          {messages.length}
        </div>
      </div>
    </div>
  )
}

export default MessageModal
