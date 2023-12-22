import express from "express";
import {addComment,getAllCommentByBlog} from "../controllers/comment-controller.js";

const commentRouter = express.Router();

commentRouter.get("/blogs/:id",getAllCommentByBlog);
commentRouter.post("/blog/add",addComment);

export default commentRouter;