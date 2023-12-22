import mongoose from "mongoose";
import Blog from "../model/Blog.js";
import Comment from "../model/Comment.js";
import User from "../model/User.js";

export const getAllCommentByBlog = async ( req, res, next) => {
    const BlogId =req.params.id;
    let blogcomments;
    try{
        blogcomments = await Blog.findById(BlogId);
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

    let exitstingUser ;
    try{
        exitstingUser = await Blog.findById(blog);
    }catch(err){
        return console.log(err);
    }if(!exitstingUser){
        return res.status(400).json({message:"Unable To Find Blog By This ID"})
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
        exitstingUser.comments.push(comment);
        await exitstingUser.save({session});
        await session.commitTransaction();
    }catch(err){
        console.log(err);
        return res.status(500).json({message: err});
    }
    return res.status(200).json({ comment });
};

// export const deletecomment = async (req , res, next) => {
//     const commentid = req.params.id;

//     let comment;
//     try{
//         comment =await Comment.findByIdAndDelete(commentid).populate("user");
//         console.log(comment);
//         if (!comment) {
//             return res.status(404).json({ message: "Blog not found" });
//         }
//         comment.blog
//         /*await blog.user.blogs.pull(blog);
//         await blog.user.save();*/
//     }catch(err){
//         return console.log(err);
//     }
//     if(!comment){
//         return res.status(400).json({message:"Unable To Delete"});
//     }
//     return res.status(200).json({message:"Successfully Delete"});
// };