import express from "express";
const router = express.Router();
import { ensureAuthenticated, isAdmin } from "../middleware/checkAuth";

router.get("/", (req, res) => {
  res.send("welcome");
});

router.get("/dashboard", ensureAuthenticated, (req, res) => {
  res.render("dashboard", {
    user: req.user,
  });
});

router.get("/admin", isAdmin, (req, res) => {
  if (req.sessionStore.all) {
    req.sessionStore.all((error, sessions) => {
      if (error) {
        console.error("Error retrieving sessions:", error);
        return res.status(500).send("Error retrieving sessions");
      }

      const typedSessions = sessions as { [sid: string]: any };

      if (typedSessions) {
        const activeSessions = Object.keys(typedSessions).map((sessionId) => {
          const session = typedSessions[sessionId];
          const userID = session.passport ? session.passport.user : "Unknown";

          return {
            sessionId: sessionId,
            userID: userID,
            revokeLink: `/revoke-session/${sessionId}`,
          };
        });

        res.render("admin", {
          user: req.user,
          sessions: activeSessions,
          messages: req.flash("info"),
        });
      } else {
        res.render("admin", {
          user: req.user,
          sessions: [],
          messages: req.flash("info"),
        });
      }
    });
  }
});
router.get("/revoke-session/:sessionId", ensureAuthenticated, (req, res) => {
  const sessionIdToRevoke = req.params.sessionId;

  req.sessionStore.destroy(sessionIdToRevoke, (error) => {
    if (error) {
      return res.status(500).send("Error revoking session");
    }
    req.flash("info", `Session ${sessionIdToRevoke} has been revoked.`);
    return res.redirect("/admin");
  });
});
export default router;
