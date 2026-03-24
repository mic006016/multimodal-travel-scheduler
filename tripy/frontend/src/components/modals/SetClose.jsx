import { useState, useEffect } from "react"
import axios from "axios"
const API_URL = import.meta.env.VITE_API_URL || "/api"
const SetClose = ({ userId }) => {
  const [pickUser, setPickUser] = useState([])

  const fetchUsers = async () => {
    const users = await axios.get(`${API_URL}/companion/getUsers`)
    console.log(users.data.users)
    setPickUser(users.data?.users?.map((user) => user.id) ?? [])
  }

  const getUsers = async (e) => {
    await axios.post(`${API_URL}/companion/toggle`, {
      userId,
      toggle: e.target.checked,
    })
    await fetchUsers()
  }

  // 렌더링 부분 수정: includes 검사 시 형변환
  const isPublic = pickUser.some((id) => String(id) === String(userId))

  useEffect(() => {
    setTimeout(() => {
      fetchUsers()
    }, 0)
  }, [])
  return (
    <div
      style={{
        userSelect: "none",
        marginLeft: "auto",
        position: "relative",
        height: "100px",
      }}
    >
      {/* {userId} */}
      {isPublic ? (
        <img src="/assets/icons/toggle_on.png" width="60px" />
      ) : (
        <img src="/assets/icons/toggle_off.png" width="60px" />
      )}

      <label
        style={{
          display: "inline-block",
          width: "120px",
          background: "transparent",
          // background: "yellow",
          textAlign: "right",
          position: "absolute",
          top: "20px",

          height: "50px",
          lineHeight: 1.2,
          cursor: "pointer",
          fontWeight: "bolder",
        }}
      >
        <input
          type="checkbox"
          checked={pickUser.includes(userId)}
          onChange={getUsers}
          style={{ display: "none", userSelect: "none" }}
        />
        {isPublic ? "공개" : "비공개"}
      </label>
    </div>
  )
}

export default SetClose
