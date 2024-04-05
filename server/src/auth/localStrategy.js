const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { UserModel } = require("../models/UserModel");

passport.use(
  new LocalStrategy(async function (usernameOrEmail, password, done) {
    try {
      const isEmail = usernameOrEmail.includes("@");

      const query = isEmail
        ? { email: usernameOrEmail }
        : { username: usernameOrEmail };

      const user = await UserModel.findOne(query);
      if (!user || !(await user.validatePassword(password))) {
        return done(null, false, {
          message: "Incorrect username/email or password.",
        });
      }

      return done(null, user);
    } catch (error) {
      console.log(error);
      return done(error);
    }
  })
);
