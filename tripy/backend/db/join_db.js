// server/db_layer/user_db.js
const pool = require("./db")

async function jointrip(userId, tripId) {
  // 1. 중복 체크
  const [counts] = await pool.query(
    "SELECT count(*) as count from usertrip where UserId=? and TripId=?",
    [userId, tripId],
  )

  if (counts[0].count > 0) {
    // 이미 있으면 에러 대신 그냥 성공 처리하거나 null 리턴 (상황에 따라 선택)
    // throw new Error("이미 등록된 여행 입니다.");
    return true
  }

  // 2. 등록
  const [result] = await pool.query(
    "INSERT INTO usertrip (UserId, TripId) VALUES (?, ?)",
    [userId, tripId],
  )

  // INSERT 결과는 result.insertId로 확인 가능
  return result.affectedRows > 0
}

async function withdrawtrip(userId, tripId) {
  // DELETE 문은 rows(배열)가 아니라 result(객체)를 반환합니다.
  const [result] = await pool.query(
    "DELETE FROM usertrip WHERE UserId=? and TripId=?",
    [userId, tripId],
  )

  console.log("Delete result:", result)

  // affectedRows가 0이면 삭제된 게 없다는 뜻 (이미 없거나, 매칭 실패)
  if (result.affectedRows === 0) return null

  return true // 성공 시 true 반환
}

async function getUsers() {
  const [rows] = await pool.query(
    "SELECT id, nickname, email FROM users WHERE search=1;",
  )
  // 배열은 그대로 리턴해도 됨
  return rows
}

async function toggleAction(userId, checked) {
  console.log("Toggle Action:", userId, checked)

  // const 키워드 추가 (기존 코드엔 전역변수로 선언됨)
  const value = checked ? 1 : 0

  // UPDATE 문도 rows가 아니라 result 객체 반환
  const [result] = await pool.query("UPDATE users SET search=? where id=?", [
    value,
    userId,
  ])

  console.log("Update result:", result)

  // 업데이트 된 행이 없으면(ID가 없으면) null
  if (result.affectedRows === 0) return null

  return true // 성공 시 true 반환
}

async function getUserByEmail(email) {
  const [rows] = await pool.query(
    "SELECT id, nickname FROM users WHERE email=?",
    [email],
  )
  // 검색 결과가 없으면 빈 배열 반환 가능
  if (!rows || rows.length === 0) return null

  return rows
}

module.exports = {
  jointrip,
  withdrawtrip,
  getUsers,
  toggleAction,
  getUserByEmail,
}
