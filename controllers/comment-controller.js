import mongoose from "mongoose";
import Blog from "../model/Blog.js";
import Comment from "../model/Comment.js";
import User from "../model/User.js";

export const getAllCommentByBlog = async ( req, res, next) => {
    const BlogId =req.params.id;
    let blogcomments;
    try{
        //blogcomments = await Comment.findById(BlogId);
        blogcomments =await Comment.find();
    }catch(err){
        return console.log(err);
    }
    if(!blogcomments){
        return res.status(404).json({message:"No Blog Found"});
    }
    return res.status(200).json({blogcomments});
};


export const addComment = async (req , res,next) => {
    const { title,description,user,blog} = req.body;

    let exitstingBlog ;
    let exitstingUser;
    try{
        exitstingBlog = await Blog.findById(blog);
        exitstingUser = await User.findById(user);
    }catch(err){
        return console.log(err);
    }if(!exitstingBlog){
        return res.status(400).json({message:"Unable To Find Blog By This ID"})
    }else if(!exitstingUser){
        return res.status(400).json({message:"Unable To Find User By This ID"})
    }
    const comment = new Comment ({
        title,
        description,
        user,
        blog,
    });
    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        await comment.save({session});
        exitstingBlog.comments.push(comment);
        exitstingUser.comments.push(comment);
        await exitstingBlog.save({session});
        await exitstingUser.save({session});
        await session.commitTransaction();
    }catch(err){
        console.log(err);
        return res.status(500).json({message: err});
    }
    return res.status(200).json({ comment });
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

    } catch (err) {
        return console.error(err);
    }
    if(!comment){
        return res.status(400).json({message:"Unable To Delete"});
    }
    return res.status(200).json({message:"Successfully Delete"});
};

export const CommentLikeandDislike = async (req, res, next) => {
    const commentId = req.params.id;
    const userId = req.body.user;
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


