import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import constants from "../utils/constants.js";
import Report from "../models/reportModel.js";

const logout = asyncHandler(async (req, res, next) => {
  console.log("call logout");

  req.session.destroy(error => {
    if(error){
      next(error);
    }else{
      console.log("Session was destroyed");
    }
  });

  res.clearCookie('connect.sid', {
    path: '/',
    httpOnly: false,
    secure: false,
    maxAge: parseInt(process.env.EXPIRE_TIME),
    sameSite: 'lax',
  })

  res.redirect('/');
});

const deleteSession = asyncHandler(async (req, res, next) => {
  req.session.destroy(error => {
    if(error){
      next(error);
    }else{
      console.log("Session was destroyed");
    }
  });
  req.session.save();
  res.status(200).json({message: "Session was destroyed"});
});

const getUserProfile = asyncHandler(async (req, res, next) => {
  try{
    const user = await User.findById(req.session.userId);
    res.send(user);
    console.log(`${user.name} go to profile page`);
    console.log("User: ", user);
  }catch(error){
    throw new Error(`Can not find user in information: ${req.session.userId}`);
  }
});

const getAllUsers = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.session.userId);
  console.log(`Calling getAllUsers by ${user.name}`);

  try{
    const user = await User.find();
    res.send(user);
    console.log(`getAllUsers: ${user}`);
  }catch(error){
    throw new Error(`Can not find all user information by: ${error}`);
  };

});

const updateRole = asyncHandler(async (req, res, next) => {
  try{
    const { id, role } = req.body;
    const updateUserRole = await User.findByIdAndUpdate(id, {role}, {new: true});

    res.send(updateUserRole);
    console.log(`updateUserRole: ${updateUserRole}`);
  }catch(error){
    throw new Error(`Can not update user role by: ${error}`);
  }
});

const home = asyncHandler(async (req, res, next) => {
  console.log("user go to home page");
});

const dashboard = asyncHandler(async (req, res, next) => {
  console.log("admin go to dashboard");
});

const profile = asyncHandler(async (req, res, next) => {
  console.log("user go to profile");
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

const status = asyncHandler(async (req, res, next) => {
  return req.user ? res.send(req.user) : res.sendStatus(401);
});

export {
  logout,
  getUserProfile,
  home,
  dashboard,
  getAllUsers,
  updateRole,
  profile,
  getReportReasons,
  ReportReasons,
  deleteSession,
  status,
};
