const Sequelize = require("sequelize")
const fs = require("fs")
const path = require("path")
const env = process.env.NODE_ENV || "production"
const config = require(__dirname + "/../config/config.js")[env]

const db = {}

// 1. Sequelize 연결 객체 생성
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config,
)

db.sequelize = sequelize

// 2. 모델 자동 로딩 (로그 추가됨)
console.log("[Debug] 모델 파일 로딩 시작:", __dirname)

fs.readdirSync(__dirname)
  .filter((file) => {
    // .js 파일만 골라내고, index.js는 제외
    return (
      file.indexOf(".") !== 0 && file !== "index.js" && file.slice(-3) === ".js"
    )
  })
  .forEach((file) => {
    try {
      // 파일 불러오기
      const model = require(path.join(__dirname, file))

      // 모델 초기화 (init)
      if (model.init) {
        model.init(sequelize)
        db[model.name] = model
        console.log(`모델 등록 성공: ${file} -> ${model.name}`)
      } else {
        console.warn(`모델 초기화 실패 (init 없음): ${file}`)
      }
    } catch (error) {
      console.error(`모델 파일 로드 중 에러: ${file}`, error)
    }
  })

// 3. 관계 설정 (associate)
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    console.log(`관계 설정 중: ${modelName}`)
    db[modelName].associate(db)
  }
})

module.exports = db
