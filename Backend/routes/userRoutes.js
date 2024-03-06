import express from "express";
import { logout, getUserProfile, getAllUsers, updateRole, getReportReasons, ReportReasons, deleteSession, status } from "../controllers/userController.js";
import { getSession,getAuthenticatedUser, getAuthenticatedAdmin, isAuthenticated } from "../middleware/authMiddleware.js";

const userRouter = express.Router();

userRouter.route("/role").get(isAuthenticated);
userRouter.route("/status").get(status);

userRouter.route("/reportReasons").get(getReportReasons);
userRouter.route("/returnreportReasons").get(ReportReasons);

userRouter.route("/dashboard")
  .get(getAuthenticatedAdmin, getAllUsers)
  .patch(getAuthenticatedAdmin, updateRole)

userRouter.route("/profile").get(getAuthenticatedUser, getUserProfile);

userRouter.route("/logout").get(logout);
userRouter.route("/deleteSession").post(deleteSession);
userRouter.get("/Userid",getSession);

export default userRouter;