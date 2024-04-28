import express, { urlencoded, json } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

app.use(urlencoded({ extended: true }));
app.use(json());
app.use(cookieParser());

import UserRouter from "./routes/user.route.js";

app.use("/users", UserRouter);

export default app;
