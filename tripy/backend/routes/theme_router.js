const express = require("express")
// 여행목록, 여행추이, 여행선호도, 여행만족도
const {
  getTripList,
  getTripTrend,
  getTripPreferences,
  getTripSatisfaction,
  getMLArguments,
  saveTripPreferencesML,
  saveEmotionTargets,
} = require("../db/theme_db")

require("dotenv").config()

const router = express.Router()
const AI_URL = process.env.AI_SERVER_URL

// ==================== 여행감성분석 조회 ====================
router.get("/trip-list", async (req, res) => {
  const userId = req.query.userId
  const year = req.query.year

  try {
    console.log("테마 라우터 /theme/trip-list GET 호출")
    const tripList = await getTripList(userId, year)
    return res.status(200).json(tripList)
  } catch (err) {
    console.error("여행목록 조회 오류:", err)
    return res.status(500).json({ error: "서버 오류" })
  }
})
// 여행추이
router.get("/trip-trend", async (req, res) => {
  const userId = req.query.userId
  const year = req.query.year

  try {
    const tripTrend = await getTripTrend(userId, year)
    return res.status(200).json(tripTrend)
  } catch (err) {
    console.error("여행추이 조회 오류:", err)
    return res.status(500).json({ error: "서버 오류" })
  }
})
// 여행선호도 조회
router.get("/trip-preferences", async (req, res) => {
  const userId = req.query.userId
  const year = req.query.year

  try {
    const tripPreferences = await getTripPreferences(userId, year)
    return res.status(200).json(tripPreferences)
  } catch (err) {
    console.error("여행선호도 조회 오류:", err)
    return res.status(500).json({ error: "서버 오류" })
  }
})
// 여행만족도 조회
router.get("/trip-satisfaction", async (req, res) => {
  const userId = req.query.userId
  const year = req.query.year

  try {
    const tripSatisfaction = await getTripSatisfaction(userId, year)

    console.error("tripSatisfaction data", tripSatisfaction)

    return res.status(200).json(tripSatisfaction)
  } catch (err) {
    console.error("여행만족도 조회 오류:", err)
    return res.status(500).json({ error: "서버 오류" })
  }
})
// ML 인자 조회 및 선호도 저장
router.get("/ml-arguments", async (req, res) => {
  const userId = req.query.userId
  const year = req.query.year

  let result = ""

  try {
    const mlArguments = await getMLArguments(userId, year)

    console.log("ML 인자 데이터:", mlArguments)

    const preferenceValue = await getPreferenceValue(mlArguments)

    console.log("선호도 조회 결과:", preferenceValue)

    const arrData = preferenceValue.result

    arrData.forEach(([TripId, PhotoId, themecode]) => {
      console.log(
        `TripId: ${TripId}, PhotoId: ${PhotoId}, themecode: ${themecode}`,
      )
      ;(async () => {
        try {
          const res = await saveTripPreferencesML(themecode, TripId)
          console.log("결과", res)
          result = res.data
        } catch (error) {
          console.error("선호도 저장 오류:", error)
          result = error
        }
      })()
    })
  } catch (err) {
    console.error("ML 인자 조회 오류:", err)
    result = res.status(500).json({ error: "서버 오류" })
  }

  return result
})
// FastAPI 선호도 값 조회
async function getPreferenceValue(requestArguments) {
  try {
    console.log("요청 parameter : ", requestArguments)

    const response = await fetch(`${AI_URL}/theme/preference`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestArguments),
    })

    if (!response.ok) {
      throw new Error(
        `FastAPI 요청 실패: ${response.status} ${response.statusText}`,
      )
    }

    const result = await response.json()

    console.log("FastAPI 응답 데이터:", result)
    return result
  } catch (error) {
    console.error("FastAPI 연결 오류:", error)
    throw error
  }
}
// 여행만족도 FastAPI 연결
router.get("/trip-fastApi-satisfaction", async (req, res) => {
  try {
    const postData = "감상평입니다"
    const satisfactionValue = await getSatisfaction(postData)

    console.log("만족도 조회 결과:", satisfactionValue)

    return res.status(200).json({ message: satisfactionValue })
  } catch (err) {
    console.error("satisfaction 연결 오류:", err)
    return res.status(500).json({ error: "서버 오류" })
  }
})

async function getSatisfaction(requestArguments) {
  try {
    console.log("요청 parameter : ", requestArguments)
    const response = await fetch(`${AI_URL}/theme/satisfaction`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestArguments),
    })

    if (!response.ok) {
      throw new Error("Satisfaction FastAPI 요청 실패")
    }
    const data = await response.json()
    console.log("Satisfaction FastAPI 응답 데이터:", data)

    data.result.items.forEach((item) => {
      const input_param = {
        satisfy: item.value,
        target: item.label,
        tripId: 1,
        photoId: 1,
      }

      saveEmotionTargets(input_param)
    })

    // const labels = data.items.map((item) => item.label);
    // const values = data.items.map((item) => item.value);

    // console.log(labels); // ["음식","교통","친절","날씨","청결","분위기","숙소","시설","안내"]
    // console.log(values); // ["L","X","X","H","L","H","X","X","X"]

    // const result = {};
    // data.items.forEach((data.item) => {
    //   result[item.label] = item.value;
    // });
  } catch (error) {
    console.error("Satisfaction FastAPI 연결 오류:", error)
    throw error
  }
}

// router.get("/connectToFastApi", async (req, res) => {
//   try {
//     await connectToFastApi();
//     return res.status(200).json({ message: "FastAPI 연결 성공" });
//   } catch (err) {
//     console.error("FastAPI 연결 오류:", err);
//     return res.status(500).json({ error: "서버 오류" });
//   }
// });

// async function connectToFastApi() {
//   // FastAPI와의 연결 로직 구현
//   try {
//     // 예: axios 또는 fetch를 사용하여 FastAPI에 요청 보내기
//     const response = await fetch(
//       "http://localhost:8000/analysis/connectfastApi"
//     );

//     if (!response.ok) {
//       throw new Error("FastAPI 요청 실패");
//     }

//     const data = await response.json();
//     console.log("FastAPI 응답 데이터:", data);
//   } catch (error) {
//     console.error("FastAPI 연결 오류:", error);
//     throw error;
//   }
// }

module.exports = router
