const JwtStrategy = require("passport-jwt").Strategy;
const passport = require("passport");
const { ExtractJwt } = require("passport-jwt");
const { UserModel } = require("../models/UserModel");
require("dotenv").config();

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET_KEY,
    },
    async (jwtPayload, done) => {
      try {
        console.log(jwtPayload);
        const user = await UserModel.findById(jwtPayload.userId);

        if (!user) {
          return done(null, false);
        }

        return done(null, user);
      } catch (error) {
        console.log(error);
        return done(error, false);
      }
    }
  )
);
