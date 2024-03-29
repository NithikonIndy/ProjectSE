import mongoose from "mongoose";
import Blog from "../models/Blog.js";
import Comment from "../models/Comment.js";
import User from "../models/userModel.js";
import ReportComment from "../models/reportCModel.js";
import constants from "../utils/constants.js";

export const getAllCommentByBlog = async (req, res, next) => {
    const BlogId = req.params.id;
    const commentsList = [];

    try {
        const blogComments = await Blog.findById(BlogId).populate("comments");
        //console.log(blogComments);
        //res.status(200).json({ blogComments });

        blogComments.comments.forEach(comment => {
            commentsList.push({
                id: comment._id,
                description: comment.description,
                likes: comment.likes,
                user: comment.user,
                blog: comment.blog,
            });
        });

        res.status(200).json({ commentsList });
    } catch (error) {
        console.log(error);
    }
};


export const addComment = async (req, res, next) => {
    const { user,description } = req.body;

    const blog = req.params.id;
    
    if (!description || /^\s*$/.test(description)) {
        console.log("Empty or whitespace text");
        return res.status(400).json({ message: "Description cannot be empty or contain only spaces" });
    }else{
        let exitstingBlog;
        let exitstingUser;
        try {
    
            exitstingBlog = await Blog.findById(blog);
            exitstingUser = await User.findById(user);
        } catch (err) {
            return console.log(err);
        } if (!exitstingBlog) {
            return res.status(400).json({ message: "Unable To Find Blog By This ID" })
        } else if (!exitstingUser) {
            return res.status(400).json({ message: "Unable To Find User By This ID" })
        }
        const comment = new Comment({
            description,
            user,
            blog,
        });
        try {
            const session = await mongoose.startSession();
            session.startTransaction();
            await comment.save({ session });
            exitstingBlog.comments.push(comment);
            exitstingUser.comments.push(comment);
            await exitstingBlog.save({ session });
            await exitstingUser.save({ session });
            await session.commitTransaction();
        } catch (err) {
            console.log(err);
            return res.status(500).json({ message: err });
        }
        return res.status(200).json({ comment });
    }
   
};


export const deleteComment = async (req, res, next) => {
    const commentId = req.params.id;
    let comment;
    let user;
    try {
        // Find the comment by ID and populate the 'blog' field
        comment = await Comment.findByIdAndDelete(commentId).populate("blog");
        if (!comment) {
            return res.status(404).json({ message: "CommentBlog not found" });
        }

        const users = comment.user;
        user = await User.findById(users);

        if (comment.blog) {
            await comment.blog.comments.pull(comment);
            await comment.blog.save();
        }

        // Remove the comment from the associated user's 'comments' array
        if (comment.user) {
            await user.comments.pull(comment);
            await user.save();
        }
        await ReportComment.deleteMany({ commentId: commentId });
    } catch (err) {
        return console.error(err);
    }
    if (!comment) {
        return res.status(400).json({ message: "Unable To Delete" });
    }
    return res.status(200).json({ message: "Successfully Delete" });
};

export const CommentLikeandUnlike = async (req, res, next) => {
    const commentId = req.params.id;
    const {userId} = req.body;
    try {
        const comment = await Comment.findById(commentId);

        if (!comment.likes.includes(userId)) {
            await comment.updateOne({ $push: { likes: userId } });
            return res.status(200).json("The comment has been liked");
        } else {
            await comment.updateOne({ $pull: { likes: userId } });
            return res.status(200).json("The comment has been disliked");
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const updateComment = async (req, res, next) => {
    const { description } = req.body;
    const commentId = req.params.id;
    let comment;
    try {
        comment = await Comment.findByIdAndUpdate(commentId, {
            description,
        });
    } catch (err) {
        return console.log(err);
    }
    if (!comment) {
        return res.status(500).json({ message: "Unable to Update The Blog" });
    }
    return res.status(200).json({ comment });
};

export const getById = async (req, res , next) => {
    const id = req.params.id;
    let comment;
    try{
        comment = await Comment.findById(id);
    }catch(err){
        return console.log(err);
    }
    if(!comment){
        return res.status(404).json({message:"No Comment Found"});
    }
    return res.status(200).json({ comment });
}

export const getCommentAccount = async (req, res, next) => {
    const userId = req.params.id;

    try{
        const user = await User.findById(userId);
        try {
            const account = await User.findOne({ email: user.email });
            res.status(200).json({ email: user.email });
            console.log(account.email);
        }catch(error){
            console.log(error);
        }
    }catch(error){
        console.log(error);
    }
};

export const reportComment = async (req, res, next) => {
    try {
        const commentId  = req.params.id;
        const { reason } = req.body;
        const fromUser = await req.user.id;

        const allowedReason = Object.values(constants.reasons);
        if (!allowedReason.includes(reason)) {
            return res.status(400).json({ error: "Invalid reason" });
        }

        const report = await ReportComment.create({
            fromUser: fromUser,
            commentId: commentId,
            reason: reason,
        });

        console.log("Report:",report);
        res.status(201).json({ message: "Report created successfully" });
    }catch(error){
        console.error(error);
        res.status(500).json({ error: "Error creating report" });
    }
};
