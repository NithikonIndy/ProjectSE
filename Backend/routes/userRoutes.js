import express from "express";
import {
  authUser,
  registerUser,
  logout,
  getUserProfile,
  updateUserProfile,
  home,
  dashboard,
  profile,
  signIn,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { OAuthCallback } from "../controllers/OAuthController.js";
import User from "../models/userModel.js";

const router = express.Router();

// router.post("/", registerUser);
// router.post("/auth", authUser);
// router.post("/logout", logoutUser);

/*router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);*/

//! completely route path
router.get("/cmuOAuthCallback", OAuthCallback);

/*
router.get("/getUser", async function (req, res) {
  
  const token = req.session.token;
  if (token) {
    res.send(token);
  }

  res.send("not found access token");
 
});
 */

//! implement in progress
router.get("/home", home);
router.get("/admin", dashboard);
router.get("/profile", profile);
router.get("/logout", logout);
router.get("/signIn", signIn);

export default router;