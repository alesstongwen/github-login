import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { VerifyCallback } from "passport-oauth2";
import {
  getUserByEmailIdAndPassword,
  getUserById,
} from "../../controllers/userController";
import { PassportStrategy } from "../../interfaces/index";

// import { User as MyUser } from "../../interfaces/user";

// declare global {
//   namespace Express {
//     interface User extends MyUser {}
//   }
// }
const localStrategy = new LocalStrategy(
  {
    usernameField: "email", // 對應ejs的表單name
    passwordField: "password",
  },
  (email, password, done) => {
    const user = getUserByEmailIdAndPassword(email, password);
    return user
      ? done(null, user)
      : done(null, false, {
          message: "Password is incorrect",
        });
  }
);

passport.serializeUser(function (
  user: Express.User,
  done: (err: any, id?: number) => void
) {
  done(null, user.id);
});

passport.deserializeUser(function (
  id: number,
  done: (err: any, user?: Express.User | false | null) => void
) {
  let user = getUserById(id);
  if (user) {
    done(null, user);
  } else {
    done(null, false);
  }
});

const passportLocalStrategy: PassportStrategy = {
  name: "local",
  strategy: localStrategy,
};

export default passportLocalStrategy;
