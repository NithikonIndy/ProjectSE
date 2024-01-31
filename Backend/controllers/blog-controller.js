import mongoose from "mongoose";
import Blog from "../models/Blog.js";
import User from "../models/userModel.js";
import Report from "../models/reportModel.js";
import constants from "../utils/constants.js";

export const getAllBlog = async ( req, res, next) => {
    let blogs;
    try{
        blogs =await Blog.find();
    }catch(err){
        return console.log(err);
    }
    if(!blogs) {
        return res.status(404).json({message: "NO Blog Found"});
    }
    return res.status(200).json({blogs});
};

export const addBlog = async ( req, res, next) => {
    const {user,description} = req.body;
    //const user = await req.session.userId;

    console.log("dfdf")

    let exitstingUser;
    try{
        exitstingUser = await User.findById(user);
    }catch(err){
        return console.log(err);
    }
    if(!exitstingUser){
        return res.status(400).json({message:"Unable To Find User By This ID"});
    }
    const blog = new Blog({
        description,
        user,
    });
    try{
        const session = await mongoose.startSession();
        session.startTransaction();
        await blog.save({session});
        exitstingUser.blogs.push(blog);
        await exitstingUser.save({session});
        await session.commitTransaction();
    }catch(err){
        console.log(err);
        return res.status(500).json({message: err});
    }
    return res.status(200).json({ blog });
};

export const updateBlog = async (req ,res ,next ) => {
    const { description } = req.body;
    const blogId =req.params.id;
    let blog;
    try{
        blog = await Blog.findByIdAndUpdate(blogId, {
            description,
        });
    }catch(err){
        return console.log(err);
    }
    if (!blog){
        return res.status(500).json({message: "Unable to Update The Blog"});
    }
    return res.status(200).json({ blog });
};

export const getById = async (req, res , next) => {
    const id = req.params.id;
    let blog;
    try{
        blog = await Blog.findById(id);
    }catch(err){
        return console.log(err);
    }
    if(!blog){
        return res.status(404).json({message:"No Blog Found"});
    }
    return res.status(200).json({ blog });
}

export const deleteBlog = async (req , res, next) => {
    const id = req.params.id;

    let blog;
    try{
        blog =await Blog.findByIdAndDelete(id).populate("user");
        console.log(blog);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        await blog.user.blogs.pull(blog);
        await blog.user.save();
    }catch(err){
        return console.log(err);
    }
    if(!blog){
        return res.status(400).json({message:"Unable To Delete"});
    }
    return res.status(200).json({message:"Successfully Delete"});
};

export const getByUserId = async (req , res , next) => {
    const userId =req.params.id;
    let userBlogs;
    try{
        userBlogs = await User.findById(userId).populate("blogs");
    }catch(err){
        return console.log(err);
    }
    if(!userBlogs){
        return res.status(404).json({message:"No Blog Found"});
    }
    return res.status(200).json({blogs:userBlogs});
};


export const LikeandUnlike = async (req, res, next) => {
    const {UserId}= req.body;
    const postId = req.params.id;


    try {
      const post = await Blog.findById(postId);
      if (!post.likes.includes(UserId)) {
        await post.updateOne({ $push: { likes: UserId } });
        return res.status(200).json("The post has been liked");
      } else {
        await post.updateOne({ $pull: { likes: UserId } });
        return res.status(200).json("The post has been disliked");
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };

// POST Method 
export const report = async (req, res, next) => {
    try{
        const postId  = req.params.id;
        const { reason } = req.body;
        const fromUser = await req.session.userId;

        // Check reasons is valid or not
        const allowedReason = Object.values(constants.reasons);
        // console.log("allowedReason: " + allowedReason);

        if (!allowedReason.includes(reason)) {
            // Check reason
            // console.log("reason:", reason);
            return res.status(400).json({ error: "Invalid reason" });
        }

        const report = await Report.create({
            fromUser: fromUser,
            postId: postId,
            reason: reason,
        });

        console.log("Report:",report);
        res.status(201).json({ message: "Report created successfully" });
    }catch(error){
        console.error(error);
        res.status(500).json({ error: "Error creating report" });
    }
};