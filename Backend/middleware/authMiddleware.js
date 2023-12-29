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
     res.status(200).send({ message: `user: ${user}` });
    }
  }catch(error){
    return next(error);
  }

});

export { getAuthenticatedUser };
