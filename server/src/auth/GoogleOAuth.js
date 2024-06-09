const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { UserModel } = require("../models/UserModel");
const { TempUserModel } = require("../models/TempUserModel");
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URI,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await UserModel.findOne({ email: profile.emails[0].value });

        if (user) {
          if (!user.oauthProvider) {
            user.oauthProvider = "google";
            user.oauthId = profile.id;
            user = await user.save();
          }

          done(null, user, { isNew: false });
        } else {
          const newUser = new TempUserModel({
            email: profile.emails[0].value,
            oauthProvider: "google",
            oauthId: profile.id,
            fullname: profile.displayName,
            isNewUser: true,
          });

          const savedUser = await newUser.save();

          done(null, savedUser);
        }
      } catch (error) {
        done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});
