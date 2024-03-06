import express from "express";
import passport from "passport";
import "../utils/passport.js";

const oauthRouter = express.Router();

oauthRouter.route("/").get(passport.authenticate("oauth2"));
oauthRouter.route("/cmuOAuthCallback").get(passport.authenticate("oauth2"//, (req, res) => {
//     console.log("sessionID: ",req.sessionID);
//     console.log(req.session);
//     console.log(req.user);
//     // res.redirect("http://localhost:5000/home");
// }
,{successRedirect: "http://localhost:5000/home"}));

export default oauthRouter;