import express from "express";
import { LikeandUnlike,getByUserId,deleteBlog,getById,updateBlog,addBlog,getAllBlog, report, getBlogAccount, getBlogsListAccount } from "../controllers/blog-controller.js";

const blogRouter = express.Router();

blogRouter.get("/",getAllBlog);
blogRouter.post("/add",addBlog);
blogRouter.put("/update/:id",updateBlog);
blogRouter.get("/:id",getById);
blogRouter.delete("/:id",deleteBlog);
blogRouter.get("/user/:id",getByUserId);
blogRouter.put("/:id/like",LikeandUnlike);

blogRouter.post("/:id/report",report);
blogRouter.get("/:id/account",getBlogAccount);
blogRouter.get("/blogsListAccounts/:id", getBlogsListAccount);


export default blogRouter;