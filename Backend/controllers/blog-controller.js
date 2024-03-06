import mongoose from "mongoose";
import Blog from "../models/Blog.js";
import Comment from "../models/Comment.js";
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

    if (!description || /^\s*$/.test(description)) {
        console.log("Empty or whitespace text");
        return res.status(400).json({ message: "Description cannot be empty or contain only spaces" });
    }else{
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
    }

    
};

export const updateBlog = async (req ,res ,next ) => {
    const {  user ,description } = req.body;
    const blogId =req.params.id;
    let blog;
    let exitstingUser;
    if (!description || /^\s*$/.test(description)){
        console.log("Empty or whitespace text");
        return res.status(400).json({ message: "Description cannot be empty or contain only spaces" });
    }else{
        try{
            exitstingUser = await User.findById(user);
        }catch(err){
            return console.log(err);
        }
        if(!exitstingUser){
            return res.status(400).json({message:"Unable To Find User By This ID"});
        }
        try{
            blog = await Blog.findByIdAndUpdate(blogId, {
                user,
                description,
            });
        }catch(err){
            return console.log(err);
        }
        if (!blog){
            return res.status(500).json({message: "Unable to Update The Blog"});
        }
        return res.status(200).json({ blog });
    }
    
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
        blog = await Blog.findByIdAndDelete(id).populate("user").populate("comments");
        console.log(blog);

        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        await Comment.deleteMany({ _id: { $in: blog.comments.map(comment => comment._id) } });
        await blog.user.blogs.pull(blog);
        await blog.user.updateOne({ $pull: { comments: { $in: blog.comments.map(comment => comment._id) } } });
        await Report.deleteMany({ postId: id });
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
        const fromUser = await req.user.id;

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


// GET Method use on Comment Page
export const getBlogAccount = async (req, res, next) => {
    const blog = req.params.id;

    try{
        const blogDetails = await Blog.findById(blog);
        try {
            const user = await User.findById(blogDetails.user);
            try{
                const account = await User.findOne({ email: user.email });
                res.status(200).json({ email: user.email });
                console.log(account.email);
            }catch(error){
                console.error(error);
            }
            //console.log(user);
        } catch (error) {
            console.error(error);
        }
        //console.log(blogDetails);
    }catch(error){
        console.error(error);
        res.status(500).json({ error: "Error getting blog account" });
    }
};

// GET Method use on Home Page
export const getBlogsListAccount = async (req, res, next) => {
    const userId = req.params.id;
    //console.log("Received userId:", userId);

    try {
        const user = await User.findById(userId);
        try {
            const accounts = await User.findOne({ email: user.email });
            res.status(200).json({ email: accounts.email });
            //console.log("accounts from backend" ,accounts.email);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Error getting blogs accounts" });
        }
        //console.log(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error getting users details" });
    }
};