import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import asyncHandler from "express-async-handler";

// @description Auth user/set token
// @route POST /api/users/auth
// @access public
const authUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @description Register a new user
// @route POST /api/users
// @access public
const registerUser = asyncHandler(async (req, res, next) => {
  /*
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    
    if(userExists){
        res.status(400);
        throw new Error("User already exists");
    }

    const user = await User.create({
        name,
        email,
        password
    });

    if(user){
        generateToken(res, user._id);
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email
        });
    }else{
        res.status(400);
        throw new Error("Invalid user data");
    }

    console.log(req.body);
    res.status(200).json({ message : 'Register user'});
    */
});

// @description Logout user
// @route POST /api/users/logout
// @access public
const logout = asyncHandler(async (req, res, next) => {
  // log user go logout
  console.log("user logged out page");

  //! destroy cookies then redirect to sign in page page
  req.session.destroy(error => {
    if(error){
      next(error);
    }else{
      console.log("Session was destroyed");
    }
  });

  res.redirect("/signIn");
});

// @description Get user profile
// @route GET /api/users/profile
// @access private
const getUserProfile = asyncHandler(async (req, res, next) => {
  //console.log(req.user);
  const user = {
    _id: req.user._id,
    account: req.user.accountType,
    name: req.user.name,
    email: req.user.email,
    organization: req.user.organization,
    message: "Get user profile",
  };
  res.status(200).json(user);
});

// @description Update user profile
// @route PUT /api/users/profile
// @access private
const updateUserProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      message: "Update user profile",
    });
  } else {
    res.status(404);
    throw new Error("User profile not found");
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

export {
  authUser,
  registerUser,
  logout,
  getUserProfile,
  updateUserProfile,
  home,
  dashboard,
  profile,
  signIn,
};
