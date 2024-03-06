import express from "express";
import passport from "passport";
import "../utils/passport.js";

const oauthRouter = express.Router();

oauthRouter.route("/").get(passport.authenticate("oauth2"));
oauthRouter.route("/cmuOAuthCallback").get(passport.authenticate("oauth2"), (req, res) => {
    console.log("sessionID: ",req.sessionID);
    console.log(req.session);
    console.log(req.user);
    res.redirect("https://65e815ab346bf9d2bfaf39d4--sunny-capybara-082670.netlify.app");
});

export default oauthRouter;