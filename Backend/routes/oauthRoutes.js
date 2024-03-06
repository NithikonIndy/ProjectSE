import express from "express";
import passport from "passport";
import "../utils/passport.js";
import {getSession} from "../middleware/authMiddleware.js"

const oauthRouter = express.Router();

oauthRouter.route("/").get(passport.authenticate("oauth2"));

oauthRouter.route("/cmuOAuthCallback").get(passport.authenticate("oauth2"//), (req, res, next) => {
    // console.log("sessionID: ",req.sessionID);
    // console.log(req.session);
    // console.log(req.user);
    // res.redirect("https://project-se-eight.vercel.app/home");
//}
,{successRedirect: "https://freebirdcpe.vercel.app/home"}));

oauthRouter.route("/getID").get(getSession);

export default oauthRouter;