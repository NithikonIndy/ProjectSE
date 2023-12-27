import generateToken from "../utils/generateToken.js";
import asyncHandler from "express-async-handler";
import { getOAuthAccessToken, getCMUBasicInfo } from "../OAuthFunct.js";
import session from "express-session";
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
      console.log("existingUser: " + existingUser);
    } else {
      //! save to the database
      const newUser = await User.create({
        accountType,
        name,
        email,
        organization,
        organizationCode,
      });
      // res.json(newUser);
      console.log("newUser: " + newUser);
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
        console.log("user role updated to ADMIN");
      } else {
        // res.json(user);
        console.log("user role is already ADMIN");
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