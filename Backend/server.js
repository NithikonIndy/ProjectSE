import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import { notfound, errorHandler } from "./middleware/errorMiddleware.js";
import session from "express-session";
import blogRouter from "./routes/blog-routes.js";
import commentRouter from "./routes/comment-routes.js";
import MongoStore from "connect-mongo";

dotenv.config();

const port = process.env.PORT || 3000;
const app = express();

connectDB();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 60*60*1000,
    },
    rolling: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
    }),
  })
);

app.use("/", userRoutes);
app.use("/api/blog",blogRouter);
app.use("/api/comments",commentRouter);


app.use(notfound);
app.use(errorHandler);

// app.get("/", (req, res) => res.send("Server is running"));
app.listen(port, () => console.log(`server listening on ${port}`));
