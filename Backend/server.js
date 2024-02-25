import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import MongoStore from "connect-mongo";
import session from "express-session";
import cors from 'cors';
import userRoutes from "./routes/userRoutes.js";
import blogRouter from "./routes/blog-routes.js";
import commentRouter from "./routes/comment-routes.js";
import oauthRoutes from "./routes/oauthRoutes.js";
import { notfound, errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();

const port = process.env.PORT || 3000;
const app = express();
// app.set('trust proxy', 1);

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
      httpOnly: false,
      secure: true,
      maxAge: parseInt(process.env.EXPIRE_TIME),
      sameSite: 'lax',
    },
    rolling: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
    }),
  })
);

app.use(cors({
  origin: ['http://localhost:5000','https://backend-b1ep.onrender.com'],
  credentials: true,
  allowedHeaders: 'set-cookie',
}));

app.use("/", oauthRoutes);
app.use("/user", userRoutes);
app.use("/api/blog", blogRouter);
app.use("/api/comments", commentRouter);

app.use(notfound);
app.use(errorHandler);

app.listen(port, () => console.log(`server listening on ${port}`));
