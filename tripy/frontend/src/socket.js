import { io } from "socket.io-client"
import { useMessageStore } from "./store/messageStore"

// const SERVER_URL = "http://localhost:5000"   // 개발 시
const SERVER_URL = "http://3.25.11.158:5000"

// const socket = io(import.meta.env.VITE_BACKEND_URL || "/api", {
const socket = io(SERVER_URL, {
  path: "/socket.io/",
  withCredentials: true,
  transports: ["websocket"],
  reconnection: true, // 연결 끊기면 자동 재시도
  autoConnect: true,
  reconnectionAttempts: 10, // 최대 10번 시도
  reconnectionDelay: 1000, // 1초 간격으로 시도
})
socket.on("connect", () => {
  console.log("소켓 연결 성공", socket.id)
})
socket.on("incoming_message", (msg) => {
  // alert("msg", msg);
  useMessageStore.getState().addMessage(msg)
})
socket.on("disconnect", (reason) => {
  console.log("소켓 연결 끊김:", reason)
  // 만약 서버에서 강제로 끊은 경우라면(io server-side disconnect)
  // 여기서 재연결 로직을 타게 하거나 상태를 업데이트할 수 있습니다.
})
socket.on("connect_error", (err) => {
  console.error("소켓 연결 에러:", err.message)
  // 인증 실패(Session 없음) 등의 에러가 발생하면 여기서 처리 가능
})
export default socket
