import express from "express";
import mongoose from "mongoose";
import router from "./routes/user-routes.js";
import blogRouter from "./routes/blog-routes.js";
import commentRouter from "./routes/comment-routes.js";


const app = express();
app.use(express.json());
app.use("/api/user",router);
app.use("/api/blog",blogRouter);
app.use("/api/comments",commentRouter);


mongoose.connect(
    
    "mongodb+srv://Admin:Thong0943598787@blogapp.a081ho3.mongodb.net/"
    )
    .then(()=>app.listen(5000))
    .then(
        ()=>console.log("connected to databse")
    )
    .catch((err)=>console.log(err));




