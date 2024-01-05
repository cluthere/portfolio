import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(bodyParser.urlencoded({ extended: true })); // we can set size limit here
app.use(express.json()); // can set limit, how much data we want
app.use(express.static("public")); // to store data in public
app.use(cookieParser());

// import routes
import userRouter from "./routes/user.routes.js";

app.use("/api/v1/users", userRouter);

export default app;
