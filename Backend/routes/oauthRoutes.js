import express from "express";
import { OAuthCallback, getOAuthSessions } from "../controllers/OAuthController.js";

const router = express.Router();

router.get("/cmuOAuthCallback", OAuthCallback);
router.get("/cmuOAuthCallback/getSession", getOAuthSessions);
router.get("/getSession", getOAuthSessions);
// router.route("/session").get(isAuthenticated);

export default router;