import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import { notfound, errorHandler } from "./middleware/errorMiddleware.js";
import { OAuthCallback } from "./controllers/OAuthController.js";
import session from "express-session";
import blogRouter from "../routes/blog-routes.js";
import commentRouter from "../routes/comment-routes.js";

dotenv.config();

const port = process.env.PORT || 3000;
const app = express();

connectDB();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  session({
    secret: "jjifijsgjifpsjifpjsipjgipwjighfiupsgifpwngiufipsjgiifipw", // Replace with a strong and secure secret key
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, // Set to true if using HTTPS
      maxAge: 60000, // Session duration in milliseconds
    },
  })
);

app.use("/", userRoutes);
app.use("/api/blog",blogRouter);
app.use("/api/comments",commentRouter);

// app.use('/api', function(req, res, next) {
//     console.log("tffdfjgyhrw7oh");
//     res.send('Welcome');
// });

app.use(notfound);
app.use(errorHandler);

// app.get("/", (req, res) => res.send("Server is running"));
app.listen(port, () => console.log(`server listening on ${port}`));
