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
import passport from "passport";
import "./utils/passport.js";

dotenv.config();

const port = process.env.PORT || 3000;
const app = express();
connectDB();

app.use(cors({
  origin: ['https://project-se-gules.vercel.app','https://backend-b1ep.onrender.com'],
  methods: ['GET', 'POST, PUT', 'DELETE', 'PATCH'],
  credentials: true,
  exposedHeaders: 'set-cookie',
  allowedHeaders: ['Content-Type', 'Authorization', 'set-cookie'],
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.disable('x-powered-by');

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      path: '/',
      httpsOnly: false,
      secure: false,
      maxAge: parseInt(process.env.EXPIRE_TIME),
      sameSite: 'none',
    },
    rolling: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/", oauthRoutes);
app.use("/api/user", userRoutes);
app.use("/api/blog", blogRouter);
app.use("/api/comments", commentRouter);

app.use(notfound);
app.use(errorHandler);

app.listen(port, () => console.log(`server listening on ${port}`));
