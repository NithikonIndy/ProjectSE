import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

const getAuthenticatedUser = asyncHandler(async (req, res, next) => {
  const authenticatedUser = await req.session.userId;
  // log authenticated user id in session
  console.log(`Authenticated userId in session: ${authenticatedUser}`);
  
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

export { getAuthenticatedUser, getAuthenticatedAdmin};
