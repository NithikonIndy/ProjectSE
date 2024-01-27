import express from "express";
import {getById,updateComment,CommentLikeandUnlike,deleteComment,addComment,getAllCommentByBlog} from "../controllers/comment-controller.js";

const commentRouter = express.Router();

commentRouter.get("/blogs/:id",getAllCommentByBlog);
commentRouter.post("/blog/:id/add",addComment);
commentRouter.delete("/blog/:id",deleteComment);
commentRouter.put("/blog/:id/like",CommentLikeandUnlike);
commentRouter.put("/update/:id",updateComment);
commentRouter.get("/blog/:id",getById);

export default commentRouter;