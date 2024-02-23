import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import thissession from "express-session";
import session from "express-session";

const getAuthenticatedUser = asyncHandler(async (req, res, next) => {
  const authenticatedUser = await req.session.userId;
  // log authenticated user id in session
  console.log(`Authenticated userId in session: ${authenticatedUser}`);
  console.log("hello");
  try{
    if (!authenticatedUser || authenticatedUser === undefined) {
     res.status(401).redirect("/signIn");
     //.send({ message: `User not authenticated: ${authenticatedUser}`});
    }else{
     const user = await User.findById(authenticatedUser);

     if(user === null){
      res.status(401).redirect("/signIn");
      next();
     }else{
      res.status(200);//.send({ message: `user: ${user}`});
      next();
     }
    }
  }catch(error){
    return next(error);
  }
});


const getAuthenticatedAdmin = asyncHandler(async (req, res, next) => {
  const authenticatedUser = await req.session.userId;
  // log authenticated user id in session
  console.log(`Authenticated userId in session: ${authenticatedUser}`);

  const authenticatedAdmin  = await User.findById(authenticatedUser);

  try{
    if(!authenticatedAdmin || authenticatedAdmin === undefined || authenticatedAdmin === null || authenticatedAdmin.role !== 'ADMIN'){
      // log if user is not authenticatedAdmin
      //(`${authenticatedAdmin.name} is not authenticated role to be admin`);
      res.redirect("/home");
    }else{
      // log check for admin role in db
      console.log(`${authenticatedAdmin.name} authenticated role to be ${authenticatedAdmin.role}`);
      res.status(200);
      next();
    }
  }catch(error){
    return next(res.redirect("/signIn"));
  }
});

const getSession = asyncHandler(async (req, res, next) => {
  try {
    const user = req.session; // Access session data directly without await
    console.log("req.session: ",req.session);
    console.log("req.session.userId: ",req.session.userId);
    res.status(200).json({user});
  } catch (err) {
    console.error(err);
    return next(err); // Pass the error to the next middleware
  }
});

// Filter the authenticated user role
const isAuthenticated = asyncHandler(async (req, res, next) => {
  const sessionId = req.session.userId;
  //console.log("sessionId:", sessionId);
  console.log("pass condition have session");
  try{
    if (!sessionId || sessionId === undefined || sessionId === null) {
      res.status(401).json("Can't find sessionId:", sessionId);
      console.log("don't pass condition type session");
    }else{
      const user = await User.findById(sessionId);
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

const getUserID = async(req,res,next) => {
  const authenticatedUser = await req.thissession;
  console.log(authenticatedUser);
}

export { getUserID,getSession, getAuthenticatedUser, getAuthenticatedAdmin, isAuthenticated};
