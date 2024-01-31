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
import { getAuthenticatedUser, getAuthenticatedAdmin, getSession, isAuthenticated } from "../middleware/authMiddleware.js";
import { OAuthCallback } from "../controllers/OAuthController.js";
import { getAllBlog } from "../controllers/blog-controller.js";

const router = express.Router();

//! completely route path
router.get("/cmuOAuthCallback", OAuthCallback);

router.route("/session").get(isAuthenticated);

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
router.get("/test",getUserProfile);
router.get("/Userid",getSession);


export default router;