const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { findUserByEmail } = require("../db/user_db");
const bcrypt = require("bcrypt");

module.exports = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        console.log(email, password);
        try {
          const exUser = await findUserByEmail(email);
          if (exUser) {
            const result = await bcrypt.compare(password, exUser.password);
            console.log(result);
            if (result) {
              done(null, exUser);
            } else {
              done(null, false, { message: "비밀번호가 일치하지 않습니다." });
            }
          } else {
            done(null, false, { message: "가입되지 않은 회원입니다." });
          }
        } catch (e) {
          console.error(e);
          done(e);
        }
      }
    )
  );
};
