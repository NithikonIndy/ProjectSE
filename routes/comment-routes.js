import express from "express";
import {CommentLikeandDislike,deleteComment,addComment,getAllCommentByBlog} from "../controllers/comment-controller.js";

const commentRouter = express.Router();

commentRouter.get("/blogs/:id",getAllCommentByBlog);
commentRouter.post("/blog/add",addComment);
commentRouter.delete("/blog/:id",deleteComment);
commentRouter.put("/blog/:id/like",CommentLikeandDislike);

export default commentRouter;