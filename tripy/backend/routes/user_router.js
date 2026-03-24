// server/routes/users.js
const express = require("express");
const {
  findUserByEmail,
  createUser,
  getUsers,
  toggleAction,
} = require("../db/user_db");
const bcrypt = require("bcrypt");
const router = express.Router();
const passport = require("passport");
const { Users } = require("../models");

// POST /api/users/login - 로그인
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (authError, user, info) => {
    try {
      if (authError) {
        console.error(authError);
        return res.status(500).json({ error: "서버 내부 에러" });
      }
      if (!user) {
        // passport-local에서 보내는 info.message 활용
        return res
          .status(401)
          .json({ error: info.message || "로그인 정보가 올바르지 않습니다." });
      }

      // Passport 로그인 시도
      return req.login(user, (loginError) => {
        if (loginError) {
          console.error(loginError);
          return res.status(500).json({ error: "로그인 처리 중 에러 발생" });
        }

        // ★ 핵심: Redis 저장소에 세션이 완전히 기록된 후 응답을 보냅니다.
        // 이 과정이 없으면 세션 저장 전에 응답이 나가서 새로고침 시 세션이 깨질 수 있습니다.
        return req.session.save((err) => {
          if (err) {
            console.error("세션 저장 에러:", err);
            return res.status(500).json({ error: "세션 저장 실패" });
          }

          // 최종 성공 응답
          console.log(req.session);
          req.session.userId = user.id;
          req.session.nickname = user.nickname;
          req.session.email = user.email;
          return res.status(200).json({
            message: "로그인 성공",
            user: {
              id: user.id,
              nickname: user.nickname,
              email: user.email,
            },
          });
        });
      });
    } catch (e) {
      console.error(e);
      return res.status(400).json({ error: e.message });
    }
  })(req, res, next);
});

// GET /api/users/me - 로그인된 사용자 정보
router.get("/me", (req, res) => {
  // Passport는 인증 성공 시 정보를 req.user에 담습니다.
  console.log("인증 여부:", req.isAuthenticated());
  console.log("로그인된 유저 정보(req.user):", req.user);
  if (req.isAuthenticated() && req.user) {
    return res.status(200).json({
      success: true,
      user: {
        id: req.user.id,
        nickname: req.user.nickname,
        email: req.user.email,
      },
    });
  }
  return res.status(401).json({ success: false, message: "로그인 필요" });
});

// POST /api/users/join - 회원가입
router.post("/join", async (req, res) => {
  const { nickname, email, password } = req.body;
  console.log(nickname, email, password);
  if (!nickname || !email || !password) {
    return res.status(400).json({ error: "이메일과 비밀번호를 입력해주세요." });
  }
  try {
    // const user = await User.findOne({ where: { email } });
    const user = await Users.findOne({ where: { email } });
    if (user) {
      return res.status(401).json({ error: "이미 등록된 유저명 입니다." });
    }
    const hash = await bcrypt.hash(password, 12);
    // console.log(hash);
    // await createUser(nickname, email, hash);
    await Users.create({ nickname, email, password: hash });
    return res.status(200).json({ message: "회원가입 성공" });
  } catch (e) {
    console.error(e);
  }
});

// POST /api/users/logout - 로그아웃
router.post("/logout", (req, res) => {
  if (!req.session) {
    return res.json({ success: true, message: "이미 로그아웃 상태입니다." });
  }

  req.session.destroy((err) => {
    if (err) {
      console.error("세션 삭제 오류:", err);
      return res.status(500).json({ error: "로그아웃 실패" });
    }

    res.clearCookie("connect.sid"); // 기본 세션 쿠키 이름
    return res.json({ success: true, message: "로그아웃 되었습니다." });
  });
});
// GET /api/users/logout - 로그아웃

module.exports = router;
