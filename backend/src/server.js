import express from "express";
import morgan from "morgan";
import cors from "cors";
import logger from "./utils/logger.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { successResponse } from "./utils/ApiResponse.js";
import { STATUS } from "./utils/statusCodes.js";
import authRouter from "./routes/auth.routes.js";

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRouter);

app.get("/", (req, res) => {
  logger.info("Home Route accessed");
  return successResponse(res, "Server is running...", {}, STATUS.OK);
});

app.use(errorHandler);

export default app;
