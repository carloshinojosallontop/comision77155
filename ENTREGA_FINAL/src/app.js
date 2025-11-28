import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import "./config/db.config.js";
import "./config/passport.config.js";
import router from "./routes/index.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api", router);

app.use(errorHandler);

export default app;
