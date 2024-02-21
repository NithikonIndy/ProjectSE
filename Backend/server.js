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
import cors from 'cors';

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
      path: '/',
      httpOnly: true,
      secure: false,
      maxAge: parseInt(process.env.EXPIRE_TIME),
    },
    rolling: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
    }),
  })
);
app.use(cors({
  origin: 'http://localhost:5000',
  credentials: true,
  withCredentials: true,
}));


// pull sessionuserid
app.get("/get-session", (req, res) => {
  const mySession = req.session.userId;
  res.send(`Session value: ${mySession}`);
});





app.use("/", userRoutes);
app.use("/api/blog", blogRouter);
app.use("/api/comments", commentRouter);


app.use(notfound);
app.use(errorHandler);

// app.get("/", (req, res) => res.send("Server is running"));
app.listen(port, () => console.log(`server listening on ${port}`));
