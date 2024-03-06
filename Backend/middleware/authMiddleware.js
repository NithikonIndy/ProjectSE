import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

//! not yet fixed
const getAuthenticatedUser = asyncHandler(async (req, res, next) => {
  const authenticatedUser = await req.session.userId;

  console.log(`Authenticated userId in session: ${authenticatedUser}`);
  try{
    if (!authenticatedUser || authenticatedUser === undefined) {
     res.status(401).redirect("/");
    }else{
     const user = await User.findById(authenticatedUser);

     if(user === null){
      res.status(401).redirect("/");
      next();
     }else{
      res.status(200);
      next();
     }
    }
  }catch(error){
    return next(error);
  }
});

//! not yet fixed
const getAuthenticatedAdmin = asyncHandler(async (req, res, next) => {
  const authenticatedUser = await req.session.userId;

  console.log(`Authenticated userId in session: ${authenticatedUser}`);

  const authenticatedAdmin  = await User.findById(authenticatedUser);

  try{
    if(!authenticatedAdmin || authenticatedAdmin === undefined || authenticatedAdmin === null || authenticatedAdmin.role !== 'ADMIN'){
      res.redirect("https://65e8083d8eccdcc85147c292--rococo-granita-54314e.netlify.app/home");
    }else{
      console.log(`${authenticatedAdmin.name} authenticated role to be ${authenticatedAdmin.role}`);
      res.status(200);
      next();
    }
  }catch(error){
    return next(res.redirect("/"));
  }
});

//! not yet fixed
const getSession = asyncHandler(async (req, res, next) => {
  try {
    const user = req.session;
    console.log("req.session: ",req.session);
    console.log("req.session.userId: ",req.session.userId);
    res.status(200).json({user});
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

// Filter the authenticated user role
const isAuthenticated = asyncHandler(async (req, res, next) => {
  try{
    if (!req.sessionID || req.sessionID === undefined || req.sessionID === null) {
      res.status(401).json("Can't find sessionId:", req.sessionID);
      console.log("don't pass condition type session");
    }else{
      const userID = req.user.id;
      const user = await User.findById(userID);
      console.log("pass condition find user data");

      switch (user.role) {
        case "USER":
          console.log("pass condition role user is", user.role);
          return res.status(200).json(user.role);
        case "ADMIN":
          console.log("pass condition role user is", user.role);
          return res.status(200).json(user.role);
        default:
          res.status(401).json("Can find user role:", user.role);
          break;
      }
    }
  }catch (err) {
    console.error(err);
    return next(err);
  }
});

export {getSession, getAuthenticatedUser, getAuthenticatedAdmin, isAuthenticated};
