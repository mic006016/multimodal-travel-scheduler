const passport = require("passport");
const local = require("./LocalStrategy");
const { Users } = require("../models");
module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser(async (id, done) => {
    try {
      // console.log("디시리얼라이즈 실행:", id);
      const user = await Users.findOne({ where: { id } });
      done(null, user);
    } catch (e) {
      console.error(e);
      done(e);
    }
  });

  local();
};
