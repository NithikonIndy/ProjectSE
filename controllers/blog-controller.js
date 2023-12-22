import mongoose from "mongoose";
import Blog from "../model/Blog.js";
import User from "../model/User.js";

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
    const { title,description, image, user } = req.body;
    
    let exitstingUser;
    try{
        exitstingUser = await User.findById(user);
    }catch(err){
        return console.log(err);
    }
    if(!exitstingUser){
        //console.log(exitstingUser)
        return res.status(400).json({message:"Unable To Find User By This ID"});
    }
    const blog = new Blog({
        title,
        description,
        image,
        user,
    });
    try{
        //await blog.save();
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
    const { title, description } = req.body;
    const blogId =req.params.id;
    let blog;
    try{
        blog = await Blog.findByIdAndUpdate(blogId, {
            title,
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

// export const LikeandDislike = async ( req , res ,next ) => {
//     const userId = req.params.id;
//     const post = Blog.findById(userId);
//     try{
//         if(!post.likes.include(req.body.userId)){
//             await post.updateOne({ $push: {likes: req.body.userId}});
//             return res.status(200).json("The post has benn liked");
//         }else{
//             await post.updateOne({ $pull: {likes:req.body.userId}});
//             return res.status(200).json("The post has been disliked");
//         }
//     }catch(err){
//         return console.log(err);
//     }
// }

// export const LikeandDislike = async ( req , res ,next ) => {
//     const { likes } = req.body;
//     const blogId = req.params.id;
//     let Count;
//     try{
//         Count = await Blog.findByIdAndUpdate(blogId, {
//             likes,
//         });
        
//         console.log(Count);
//         if(!Count){
//             await Count.updateOne({ $push: {likes}});
//             return res.status(200).json("The post has benn liked");
//         }else{
//             await Count.updateOne({ $pull: {likes}});
//             return res.status(400).json("The post has been disliked");
//         }
//     }catch(err){
//         return console.log(err);
//     }
// }

export const LikeandDislike = async (req, res, next) => {
    const userId = req.params.id;
    try {
      const post = await Blog.findById(userId);
  
      if (!post.likes.includes(req.body.user)) {
        await post.updateOne({ $push: { likes: req.body.user } });
        return res.status(200).json("The post has been liked");
      } else {
        await post.updateOne({ $pull: { likes: req.body.user } });
        return res.status(200).json("The post has been disliked");
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };