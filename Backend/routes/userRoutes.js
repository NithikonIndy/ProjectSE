import express from "express";
import {
  authUser,
  registerUser,
  logout,
  getUserProfile,
  updateUserProfile,
  home,
  dashboard,
  getAllUsers,
  updateRole,
  profile,
  signIn,
} from "../controllers/userController.js";
import { getAuthenticatedUser, getAuthenticatedAdmin } from "../middleware/authMiddleware.js";
import { OAuthCallback } from "../controllers/OAuthController.js";
import { getAllBlog } from "../controllers/blog-controller.js";

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
router
  .route("/home")
  .get(getAuthenticatedUser, getAllBlog);
  //.get(getAuthenticatedUser, home);
  //.get("/home", home);
router
  .route("/admin")
  /*.get(getAuthenticatedAdmin, dashboard)*/
  .get(getAuthenticatedAdmin, getAllUsers)
  .patch(getAuthenticatedAdmin, updateRole)
router
  .route("/profile")
  //.get(getAuthenticatedUser, profile)
  .get(getAuthenticatedUser, getUserProfile);
router.get("/logout", logout);
router.get("/signIn", signIn);

export default router;