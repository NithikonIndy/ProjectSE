import express from "express";
import { LikeandDislike,getByUserId,deleteBlog,getById,updateBlog,addBlog,getAllBlog } from "../controllers/blog-controller.js";

const blogRouter = express.Router();

blogRouter.get("/",getAllBlog);
blogRouter.post("/add",addBlog);
blogRouter.put("/update/:id",updateBlog);
blogRouter.get("/:id",getById);
blogRouter.delete("/:id",deleteBlog);
blogRouter.get("/user/:id",getByUserId);
blogRouter.put("/:id/like",LikeandDislike);

export default blogRouter;