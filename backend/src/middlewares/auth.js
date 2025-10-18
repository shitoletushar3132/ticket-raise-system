import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { errorResponse } from "../utils/ApiResponse.js";
import { STATUS } from "../utils/statusCodes.js";

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return errorResponse(
      res,
      "Not authorized to access this route",
      STATUS.UNAUTHORIZED
    );
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    if (!req.user) {
      return errorResponse(res, "User Not Found", STATUS.UNAUTHORIZED);
    }

    next();
  } catch (error) {
    return errorResponse(
      res,
      "Not authorized to access this route",
      STATUS.UNAUTHORIZED
    );
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return errorResponse(
        res,
        `User role '${req.user.role}' is not authorized to access this route`,
        STATUS.FORBIDDEN
      );
    }
    next();
  };
};

export { protect, authorize };
