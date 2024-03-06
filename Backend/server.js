import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import { notfound, errorHandler } from "./middleware/errorMiddleware.js";
import session from "express-session";
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

// CORS headers ที่ใช้กับทุก request ที่เข้ามายัง Express server
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://project-se-gules.vercel.app');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

// ตั้งค่า CORS ที่ใช้กับทุก route ของแอป
app.use(cors({
  origin: 'https://project-se-gules.vercel.app',
  methods: 'GET, POST, PUT, DELETE, PATCH',
  credentials: true,
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
      httpOnly: true,
      secure: false,
      maxAge: parseInt(process.env.EXPIRE_TIME),
<<<<<<< HEAD
=======
      sameSite: 'none',
>>>>>>> parent of d7de2f5 (old)
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

<<<<<<< HEAD
// app.get("/", (req, res) => res.send("Server is running"));
app.listen(port, () => console.log(`server listening on ${port}`));
=======
app.listen(port, () => console.log(`server listening on ${port}`));
>>>>>>> parent of d7de2f5 (old)
