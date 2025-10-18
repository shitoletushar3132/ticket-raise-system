import connectDB from "./config/db.js";
import app from "./server.js";
import dotenv from "dotenv";
import logger from "./utils/logger.js";

dotenv.config();

const PORT = process.env.port || 3000;

connectDB().then(() =>
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  })
);
