import generateToken from "../utils/generateToken.js";
import asyncHandler from "express-async-handler";
import { getOAuthAccessToken, getCMUBasicInfo } from "../OAuthFunct.js";
import session, { Session } from "express-session";
import User from "../models/userModel.js";

// @description GET user info from func OAuthCallback
// @route GET /api/cmuOAuthCallback
// @access private

const OAuthCallback = asyncHandler(async (req, res, next) => {
  const code = req.query.code;
  const access_token = await getOAuthAccessToken(code);
  const user = await getCMUBasicInfo(access_token);

  // log cmu basic info from access token
  console.log("getCMUBasicInfo: ", user);

  const information = {
    accountType: user.itaccounttype_EN,
    name: user.firstname_EN + " " + user.lastname_EN,
    email: user.cmuitaccount,
    organization: user.organization_name_EN,
    organizationCode: user.organization_code,
  };

  const { accountType, name, email, organization, organizationCode } = information;
  // log information about the account
  console.log("information: ", information);

  //! Check if the user already exists
  try {
    const existingUser = await User.findOne({
      name: information.name,
      email: information.email,
    });

    if (existingUser) {
      // res.send(existingUser);

      //! Check existing user session has been set
      if(req.session.userId !== existingUser._id){
        console.log(`BEFORE SET SESSION OF USER ID: ${req.session.userId} -> ${existingUser._id}`);
        req.session.userId = existingUser._id;
        console.log(`AFTER SET SESSION OF USER ID: ${req.session.userId} -> ${existingUser._id}`);
      }
      
      // log session userID with userID in db
      console.log("session userID: " + req.session.userId);
      console.log(`existingUser: ${existingUser}`);
    } else {
      //! save to the database
      const newUser = await User.create({
        accountType,
        name,
        email,
        organization,
        organizationCode,
      });
    
      //! Check new user session has been set
      if(req.session.userId !== newUser._id){
        console.log(`BEFORE SET SESSION OF USER ID: ${req.session.userId} -> ${newUser._id}`);
        req.session.userId = newUser._id;
        console.log(`AFTER SET SESSION OF USER ID: ${req.session.userId} -> ${newUser._id}`);
      }

      // res.json(newUser);
      // log session userID with userID in db
      console.log("session userID: " + req.session.userId);
      console.log(`newUser: ${newUser}`);
    }
  } catch (error) {
    console.log(error);
  }

  try {
    const user = await User.findOne({
      name: process.env.NAME_ADMIN,
      email: process.env.EMAIL_ADMIN,
      role: process.env.OLD_ROLE_ADMIN,
    });

    if (user) {
      if (user.role === process.env.OLD_ROLE_ADMIN) {
        await user.updateOne({ role: "ADMIN" });
        // res.json({ role: "ADMIN" });
        console.log(`${user.name} role updated to ADMIN`);
      } else {
        // res.json(user);
        console.log(`${user.name} role is already ADMIN`);
      }
    }
  } catch (error) {
    throw new Error(`Cannot update user role`);
  }

  if (!code) {
    res.status(400);
    throw new Error(`Invalid authorization code ${code}`);
  }

  res.redirect(process.env.REDIRECT_URL_TO_HOMEPAGE);
});

export { OAuthCallback };