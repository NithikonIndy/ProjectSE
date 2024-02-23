import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import constants from "../utils/constants.js";
import Report from "../models/reportModel.js";

// @description Logout user
// @route GET /logout
// @access public
const logout = asyncHandler(async (req, res, next) => {
  // log user go logout
  console.log("user logged out page");

  //! destroy cookies then redirect to sign in page page
  req.session.destroy(error => {
    if(error){
      next(error);
    }else{
      console.log("Session was destroyed" , req.session);
    }
  });

  res.redirect("/signIn");
});

const deleteSession = asyncHandler(async (req, res, next) => {
  // destroy cookies 
  req.session.destroy(error => {
    if(error){
      next(error);
    }else{
      console.log("Session was destroyed");
    }
  });
  res.status(200).json({message: "Session was destroyed"});
});

// @description Get user profile
// @route GET /profile
// @access private
const getUserProfile = asyncHandler(async (req, res, next) => {
  // res.redirect("/profile Page");

  try{
    const user = await User.findById(req.session.userId);
    res.send(user);

    // log user go profile page
    console.log(`${user.name} go to profile page`);
    // log user information in db
    console.log("User: ", user);
  }catch(error){
    throw new Error(`Can not find user in information: ${req.session.userId}`);
  }
});

// @description Get all user information
// @route GET /users
// @access private
const getAllUsers = asyncHandler(async (req, res, next) => {
  // log if call func getAllUsers
  const user = await User.findById(req.session.userId);
  console.log(`Calling getAllUsers by ${user.name}`);

  try{
    const user = await User.find();
    res.send(user);
    // log getAllUsers information
    console.log(`getAllUsers: ${user}`);
  }catch(error){
    throw new Error(`Can not find all user information by: ${error}`);
  };

});

// @description PATCH update field role on user
// @route PATCH /updateRole
// @access private
const updateRole = asyncHandler(async (req, res, next) => {
  try{
    const { id, role } = req.body;

    // update user role from request
    const updateUserRole = await User.findByIdAndUpdate(id, {role}, {new: true});
    res.send(updateUserRole);
    // log updateUserRole information
    console.log(`updateUserRole: ${updateUserRole}`);
  }catch(error){
    throw new Error(`Can not update user role by: ${error}`);
  }
});


const home = asyncHandler(async (req, res, next) => {
  // log if user go to home page
  console.log("user go to home page");
  res.send("Welcome to home page");
});

const dashboard = asyncHandler(async (req, res, next) => {
  // log if admin go to dashboard
  console.log("admin go to dashboard");
  res.send("Welcome to dashboard");
});

const profile = asyncHandler(async (req, res, next) => {
  // log if user go to profile page
  console.log("user go to profile");
  res.send("Welcome to profile page");
});

const signIn = asyncHandler(async (req, res, next) => {
  res.redirect(process.env.NEXT_PUBLIC_CMU_OAUTH_URL);
  console.log("redirect to sign in with cmu authentication");
});


const getReportReasons = async (req, res, next) => {
  try{
      const reportReason = Object.values(constants.reasons);
      console.log(reportReason);
      res.send(reportReason);
  }catch(error){
      console.error(error);
      res.status(500).json({ error: "Error getting report reasons" });
  }
};
const ReportReasons = async (req, res, next) => {
  try{
      const reportReason = await Report.find();
      res.send(reportReason);
  }catch(error){
      console.error(error);
      res.status(500).json({ error: "Error getting report reasons" });
  }
};

export {
  logout,
  getUserProfile,
  home,
  dashboard,
  getAllUsers,
  updateRole,
  profile,
  signIn,
  getReportReasons,
  ReportReasons,
  deleteSession,
};
