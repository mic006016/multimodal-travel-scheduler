require("dotenv").config()
const express = require("express")
const path = require("path")
const cookieParser = require("cookie-parser")
const session = require("express-session")
const passport = require("passport")
const cors = require("cors")
const http = require("http")
const { Server } = require("socket.io")

// Redis 관련
const { createClient } = require("redis")
const { RedisStore } = require("connect-redis")

// 라우터 임포트
const mainRouter = require("./routes/main_router")
const planRouter = require("./routes/plan_router")
const reviewRouter = require("./routes/review_router")
const userRouter = require("./routes/user_router")
const uploadRouter = require("./routes/upload_router")
const albumRouter = require("./routes/album_router")
const analysisRouter = require("./routes/analysis_router")
const recommendRouter = require("./routes/recommend_router")
const companionRouter = require("./routes/companion_router")
const chatRouter = require("./routes/chatbot_router")
const themeRouter = require("./routes/theme_router") // 여행감성분석
const boardRouter = require("./routes/board_router")

// 설정 및 소켓 핸들러
const passportConfig = require("./passport")
const registerSocketHandlers = require("./socket") // 소켓 핸들러 파일
const { sequelize } = require("./models")

const app = express()
const server = http.createServer(app)

// 1. Redis 클라이언트 생성 (Docker 환경 변수 적용)
const redisClient = createClient({
  url: `redis://${process.env.REDIS_HOST || "tripy_redis"}:${
    process.env.REDIS_PORT || 6379
  }`,
})

redisClient.on("connect", () => console.log("Redis 연결 성공"))
redisClient.on("error", (err) => console.error("Redis 연결 에러:", err))

redisClient.connect().catch(console.error)

// // 2. MySQL 연결 (sequelize)
// sequelize
//   .sync({ alter: true })
//   .then(() => {
//     console.log(`데이터베이스 연결 성공 (Host: ${process.env.DB_HOST})`)
//   })
//   .catch((e) => {
//     console.error("데이터베이스 연결 실패:", e)
//   })

// 3. CORS 설정 (Nginx 포트 추가)
const allowedOrigins = [
  process.env.VITE,
  "http://3.25.11.158",
  process.env.NGINX,
  process.env.EXPO,
  "http://localhost:5173",
]

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"], // [추가 권장] 허용 메소드 명시
    credentials: true,
  },
})

// ▼▼▼ [디버깅용 추가] 연결 에러 로그 찍기 ▼▼▼
io.engine.on("connection_error", (err) => {
  console.log("❌ 소켓 연결 에러 발생!")
  console.log("코드:", err.code) // 예: 0(전송 에러), 1(세션 에러), 2(핸드셰이크 에러), 3(Bad Request)
  console.log("메시지:", err.message) // 예: "websocket error", "transport reject"
  console.log("컨텍스트:", err.context) // 에러 발생 상황
})
// ▲▲▲ 여기까지 ▲▲▲

app.use(
  cors({
    origin: function (origin, callback) {
      // origin이 없으면(예: Postman 등) 허용, 있으면 리스트에 있는지 확인
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        callback(new Error("Not allowed by CORS"))
      }
    },
    credentials: true, // 세션/쿠키를 사용하므로 필수!
  }),
)

passportConfig()

app.set("port", process.env.PORT || 5000)

// ★★★ 여기서 세션 미들웨어 등록 (라우터보다 먼저!) ★★★
const sessionMiddleware = session({
  store: new RedisStore({ client: redisClient, prefix: "sess:" }),
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET || "PASSWORD",
  rolling: true,
  proxy: true, // 추가: 포트가 다르거나 프록시 환경일 때 쿠키 안정성 향상
  cookie: {
    maxAge: 1000 * 60 * 30,
    httpOnly: true,
    secure: false, // http 환경이므로 false
    sameSite: "lax", // 명시적 추가
    path: "/", // 모든 경로에서 쿠키 유효
  },
})

// 필수 미들웨어들
app.use(express.static(path.join(__dirname, "public")))
// [수정 후] - 프로젝트 실행 루트(root) 기준으로 uploads 폴더를 찾음 (더 안전함)
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")))
// 혹시 /img 경로로도 접근한다면 같이 수정
app.use("/img", express.static(path.join(process.cwd(), "uploads")))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(sessionMiddleware)
app.use(passport.initialize())
app.use(passport.session())
// 라우터 등록 (세션 설정 이후에!)
app.use("/api/main", mainRouter)

//플랜 라우터 연결
app.use("/api/plan", planRouter)

// 리뷰게시판 라우터 연결
app.use("/api/review", reviewRouter)

// 사용자 라우터 연결
app.use("/api/users", userRouter)
app.use("/api/upload", uploadRouter)
// 앨범 라우터 연결
app.use("/api/album", albumRouter)

//앨범 라우터 연결
app.use("/api/album", albumRouter)

//분석 라우터 연결
app.use("/api/analysis", analysisRouter)

//추천 라우터 연결
app.use("/api/recommend", recommendRouter)
app.use("/api/companion", companionRouter)

//챗봇 라우터 연결
app.use("/api/chatbot", chatRouter)

// 여행감성분석 라우터 연결
app.use("/api/theme", themeRouter)

const wrap = (middleware) => (socket, next) =>
  middleware(socket.request, {}, next)

io.use(wrap(sessionMiddleware))
io.use(wrap(passport.initialize()))
io.use(wrap(passport.session()))

// 소켓 핸들러 등록
registerSocketHandlers(io)

// 기본 라우트
app.get("/api", (req, res) => {
  res.send("🚀 /api간단 게시판 API 서버 실행 중")
})

// 기본 라우트
app.get("/", (req, res) => {
  res.send("🚀 /간단 게시판 API 서버 실행 중")
})

const PORT = process.env.PORT || 5000
server.listen(PORT, "0.0.0.0", () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`)
})
