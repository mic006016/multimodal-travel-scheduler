// chatbotLogic.js
const SCENARIOS = require("./chatbotData");
const axios = require("axios");

const FASTAPI_URL = `${process.env.AI_SERVER_URL}/chatbot/`;

const getBotResponse = async (userId, message) => {
  // 공백 제거 및 소문자 변환
  const msg = message.trim().replace(/ /g, "");

  // === 1. 메인 메뉴 & 초기화 ===
  const helloKeywords = ["안녕", "반가", "하이", "시작", "메뉴", "처음"];
  if (helloKeywords.some((keyword) => msg.includes(keyword))) {
    return SCENARIOS.welcome;
  }

  // === 2. 여행지 추천 (진입) ===
  if (msg.includes("1") || msg.includes("추천") || msg.includes("여행지")) {
    return SCENARIOS.recommend_main;
  }

  // === 3. 인기 코스 (진입) ===
  if (msg.includes("2") || msg.includes("코스") || msg.includes("인기")) {
    return SCENARIOS.course_main;
  }

  // === 4. 고객센터 (진입) ===
  if (
    msg.includes("3") ||
    msg.includes("고객센터") ||
    msg.includes("센터") ||
    msg.includes("문의")
  ) {
    return SCENARIOS.support;
  }

  // === 5. 세부 시나리오 (추천) ===
  if (msg.includes("힐링") || msg.includes("휴식") || msg.includes("숲"))
    return SCENARIOS.healing;
  if (msg.includes("액티비티") || msg.includes("서핑") || msg.includes("운동"))
    return SCENARIOS.activity;
  if (msg.includes("먹방") || msg.includes("맛집") || msg.includes("음식"))
    return SCENARIOS.mukbang;

  // === 6. 세부 시나리오 (코스) ===
  if (msg.includes("인천") || msg.includes("월미도") || msg.includes("차이나"))
    return SCENARIOS.course_incheon;
  if (msg.includes("가평") || msg.includes("남이섬") || msg.includes("캠핑"))
    return SCENARIOS.course_gapyeong;

  // === 7. 이스터 에그 ===
  if (msg.includes("집") || msg.includes("퇴근") || msg.includes("힘들"))
    return SCENARIOS.gohome;

  // === [추가] 감정 표현 및 이모티콘 처리 ===
  if (
    msg.includes("ㅡㅡ") ||
    msg.includes("-_-") ||
    msg.includes("짜증") ||
    msg.includes("바보") ||
    msg.includes("답답")
  ) {
    return SCENARIOS.angry;
  }
  if (
    msg.includes("ㅠㅠ") ||
    msg.includes("ㅜㅜ") ||
    msg.includes("ㅠ") ||
    msg.includes("우울")
  ) {
    return SCENARIOS.sad;
  }
  if (
    msg.includes("ㅋㅋ") ||
    msg.includes("ㅎㅎ") ||
    msg.includes("ㅋ") ||
    msg.includes("ㅎ")
  ) {
    return SCENARIOS.laugh;
  }

  // ============================================================
  // 🤖 AI 상담원 연결 (나머지 모든 경우 처리)
  // ============================================================

  // 4번 메뉴를 직접 눌렀거나, 위에서 처리되지 않은 모든 메시지는 AI에게 물어봄
  const isAgentRequest = ["4", "ai", "상담", "연결", "도움", "AI상담원"].some(
    (k) => msg.toLowerCase().includes(k),
  );

  // 시나리오에 없는 내용이면 AI에게 넘김 (기존의 unknown 로직 대체)
  try {
    console.log(` Node -> FastAPI 요청 보냄: ${message}`);

    // ★ FastAPI로 POST 요청 전송
    const response = await axios.post(FASTAPI_URL, {
      message: message, // 유저 질문 전달
      userId: userId, // 유저 ID 전달
    });

    // FastAPI가 준 답변({ result: "..." })에서 텍스트만 꺼냄
    const aiReply = response.data.result;

    return ` [AI 가이드]: ${aiReply}`;
  } catch (error) {
    console.error("❌ FastAPI 연결 실패:", error.message);
    // AI 연결 실패 시에만 기존 unknown 메시지 출력 (혹은 에러 메시지)
    return SCENARIOS.unknown(message);
  }
};

module.exports = { getBotResponse };
