// server/db_layer/user_db.js
const pool = require("./db")

/**
 * 1. 여행감성분석 조회
 *  - 년간 여행건수 추이 라인그래프
 *  - 지역별 선호도 파이그래프
 *  - 지역별 만족도 파이그래프
 * 2. 선호도 ML 저장
 *  - fastapi 서버에서 생성
 * 3. 만족도 ollama.gemma 조회
 *  - fastapi 서버에서 생성
 **/

// 1. 여행감성분석 조회
async function getTripList(userId, year) {
  const sql_list = `SELECT A.id, A.title, A.description, DATE_FORMAT(A.createdAt, '%Y/%m/%d') AS createdAt 
                      FROM trips A INNER JOIN usertrip B 
                        ON A.id = B.tripId 
                     WHERE B.userId = ?
                       AND A.createdAt LIKE '%${year}%'                       
                     ORDER BY A.createdAt DESC
                     LIMIT 5`
  const [rows] = await pool.query(sql_list, [userId])

  return rows
}
// 2. 년간 여행건수 추이 라인그래프
async function getTripTrend(userId, year) {
  const sql_trend = `SELECT M.yy
                          , M.mm
                          , SUM(M.val) AS val
                        FROM (     
                          SELECT X.YY AS yy
                              , X.MM AS mm
                              , SUM(X.VAL) AS val
                            FROM (   
                                SELECT DATE_FORMAT(A.createdAt, '%Y') AS YY
                                    , DATE_FORMAT(A.createdAt, '%m') AS MM
                                    , 1 AS VAL
                                  FROM trips A INNER JOIN usertrip B 
                                    ON A.id = B.tripId 
                                  WHERE B.userId = ? 
                                    AND A.createdAt LIKE '%${year}%') X
                            GROUP BY X.yy, X.mm
                          UNION SELECT DATE_FORMAT(CURDATE(),'%Y') AS yy, '01' AS mm , 0 AS val    
                          UNION SELECT DATE_FORMAT(CURDATE(),'%Y') AS yy, '02' AS mm , 0 AS val    
                          UNION SELECT DATE_FORMAT(CURDATE(),'%Y') AS yy, '03' AS mm , 0 AS val    
                          UNION SELECT DATE_FORMAT(CURDATE(),'%Y') AS yy, '04' AS mm , 0 AS val    
                          UNION SELECT DATE_FORMAT(CURDATE(),'%Y') AS yy, '05' AS mm , 0 AS val    
                          UNION SELECT DATE_FORMAT(CURDATE(),'%Y') AS yy, '06' AS mm , 0 AS val    
                          UNION SELECT DATE_FORMAT(CURDATE(),'%Y') AS yy, '07' AS mm , 0 AS val    
                          UNION SELECT DATE_FORMAT(CURDATE(),'%Y') AS yy, '08' AS mm , 0 AS val    
                          UNION SELECT DATE_FORMAT(CURDATE(),'%Y') AS yy, '09' AS mm , 0 AS val    
                          UNION SELECT DATE_FORMAT(CURDATE(),'%Y') AS yy, '10' AS mm , 0 AS val    
                          UNION SELECT DATE_FORMAT(CURDATE(),'%Y') AS yy, '11' AS mm , 0 AS val
                          UNION SELECT DATE_FORMAT(CURDATE(),'%Y') AS yy, '12' AS mm , 0 AS val  ) M
                      GROUP BY M.yy, M.mm`

  console.log("Trip Trend Params:", userId, year)
  const [rows] = await pool.query(sql_trend, [userId], [year])

  return rows
}

async function getTripPreferences(userId, year) {
  const sql_preferences = `SELECT IF(A.themecode = 1,'자연관광',IF(A.themecode = 2,'역사문화',IF(A.themecode = 3, '엔터테인먼트','기타'))) name
                                , COUNT(A.themecode) AS value   
                              FROM themes A INNER JOIN usertrip B 
                                ON A.tripId = B.tripId 
                            WHERE B.userId = ? 
                              AND A.createdAt LIKE '%${year}%'
                             GROUP BY A.themecode`
  const [rows] = await pool.query(sql_preferences, [userId], [year])
  return rows
}

async function getTripSatisfaction(userId, year) {
  const sql_satisfaction = `SELECT t1.target AS name
                                 , CAST(SUM(if(t1.satisfaction = 'H', 1, 0)) AS UNSIGNED) AS satis
                                 , CAST(SUM(if(t1.satisfaction IN ('L','X'), 1, 0)) AS UNSIGNED) AS dissatis
                              FROM emotionsTargets t1
                             WHERE t1.createdAt LIKE '%${year}%'
                             GROUP BY t1.tripId, t1.target`
  const [rows] = await pool.query(sql_satisfaction, [userId], [year])
  return rows
}

// ML argumnets 추출
async function getMLArguments(userId, year) {
  const sql_ml_args = `SELECT IFNULL(M2.tripId,1) AS tripId, IFNULL(M2.photoId,2) AS photoId, M1.category, if(M2.photoId IS NULL, 0, 1)  AS val
                         FROM 
                         (
                            SELECT T3.id, T3.category 
                              FROM categories T3
                          ) M1 LEFT OUTER JOIN 
                          (
                            SELECT T1.id, T1.tripId, T2.categoryId, T2.photoId, T4.themecode
                              FROM photos T1 INNER JOIN photoCategoryMaps T2 ON T1.id = T2.photoId
                                             LEFT OUTER JOIN themes T4 ON T1.tripId = T4.tripId
                            WHERE userId = ?
                              AND T1.createdAt LIKE '%${year}%' 
                              AND (T1.tripId, T4.themecode) NOT IN (SELECT T5.tripId, T5.themecode FROM themes T5)
                          ) M2	 		 
                          ON M1.id = M2.categoryId`

  const [rows] = await pool.query(sql_ml_args, [userId], [year])
  return rows
}

// 2. 선호도 ML 저장
async function saveTripPreferencesML(themecode, TripId) {
  const sql_insert = `INSERT INTO themes (themecode, createdAt, tripId) 
                                  VALUES (?, CURRENT_TIMESTAMP, ?)`
  const values = [themecode, TripId]

  return new Promise((resolve, reject) => {
    pool.query(sql_insert, values, (error, results) => {
      if (error) {
        console.error("Error inserting trip preferences ML data:", error)
        reject(error)
      } else {
        console.log("Trip preferences ML data inserted successfully:", results)
        resolve(results)
      }
    })
  })
}

const saveEmotionTargets = async (data) => {
  const satisfy = data.satisfy
  const target = data.target
  const tripId = data.tripId
  const photoId = data.photoId

  const values = [satisfy, target, tripId, photoId]

  const sql_emotionT = `INSERT INTO emotionsTargets (satisfaction, target, createdAt, tripId, photoId)
							                               VALUES (?,?,CURRENT_TIMESTAMP,?,?)`
  return new Promise((resolve, reject) => {
    pool.query(sql_emotionT, values, (error, results) => {
      if (error) {
        console.error("Error inserting trip satisfy data:", error)
        reject(error)
      } else {
        console.log("Trip satisfy data inserted successfully:", results)
        resolve(results)
      }
    })
  })
}

module.exports = {
  getTripList,
  getTripTrend,
  getTripPreferences,
  getTripSatisfaction,
  getMLArguments,
  saveTripPreferencesML,
  saveEmotionTargets,
}
