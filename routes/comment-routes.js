import express from "express";
import {updateComment,CommentLikeandDislike,deleteComment,addComment,getAllCommentByBlog} from "../controllers/comment-controller.js";

const commentRouter = express.Router();

commentRouter.get("/blogs/:id",getAllCommentByBlog);
commentRouter.post("/blog/add",addComment);
commentRouter.delete("/blog/:id",deleteComment);
commentRouter.put("/blog/:id/like",CommentLikeandDislike);
commentRouter.put("/update/:id",updateComment);

export default commentRouter;