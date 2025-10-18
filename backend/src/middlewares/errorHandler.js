import { errorResponse } from "../utils/ApiResponse.js";
import logger from "../utils/logger.js";
import { STATUS } from "../utils/statusCodes.js";

export const errorHandler = (err, req, res, next) => {
  logger.error(`${err.message} - ${req.originalUrl}`);
  return errorResponse(
    res,
    err.message || "Internal Server Error",
    STATUS.INTERNAL_SERVER_ERROR,
    err
  );
};
