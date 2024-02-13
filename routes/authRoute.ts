import express from "express";
import passport from "passport";
import { forwardAuthenticated } from "../middleware/checkAuth";

const router = express.Router();

router.get("/login", forwardAuthenticated, (req, res) => {
  res.render("login");
});

router.post("/login", (req, res, next) => {
  passport.authenticate(
    "local",
    (err: any, user: Express.User | false, info: any) => {
      if (err) {
        req.flash("error", err.message);
        return res.redirect("/auth/login");
      } else if (!user) {
        req.flash("error", info.message);
        return res.redirect("/auth/login");
      }
      req.logIn(user, (err) => {
        if (err) {
          req.flash("error", err.message);
          return res.redirect("/dashboard");
        }
        return res.redirect("/dashboard");
      });
    }
  )(req, res, next);
});

router.get("/github", passport.authenticate("github"));

router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/dashboard");
  }
);

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) console.log(err);
  });
  res.redirect("/auth/login");
});

export default router;
