import authService from "../services/auth.service.js";
import { errorResponse, successResponse } from "../utils/ApiResponse.js";
import logger from "../utils/logger.js";
import { STATUS } from "../utils/statusCodes.js";
import {
  loginValidation,
  registerValidation,
} from "../validations/auth.validation.js";

class AuthController {
  async register(req, res) {
    try {
      console.log(req.body);
      if (!req.body) {
        return errorResponse(
          res,
          "Request body is missing",
          STATUS.BAD_REQUEST
        );
      }
      const { error } = registerValidation(req.body);
      if (error) {
        return errorResponse(res, error.details[0].message, STATUS.BAD_REQUEST);
      }

      const result = await authService.register(req.body);
      return successResponse(
        res,
        "Register Successfully",
        result,
        STATUS.CREATED
      );
      m;
    } catch (error) {
      logger.error(error.stack);
      errorResponse(res, error.message, STATUS.BAD_REQUEST);
    }
  }

  async login(req, res) {
    try {
      if (!req.body) {
        return errorResponse(
          res,
          "Request body is missing",
          STATUS.BAD_REQUEST
        );
      }
      const { error } = loginValidation(req.body);
      if (error) {
        return errorResponse(res, error.details[0].message, STATUS.BAD_REQUEST);
      }
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      return successResponse(res, "Login Successfully", result);
    } catch (error) {
      errorResponse(res, error.message, STATUS.BAD_REQUEST);
    }
  }

  async getMe(req, res) {
    try {
      const user = await authService.getProfile(req.user.id);
      return successResponse(res, "Fetch User Profile", user, STATUS.OK);
    } catch (error) {
      errorResponse(res, error.message, STATUS.BAD_REQUEST);
    }
  }

  async getAllUsers(req, res) {
    try {
      const users = await authService.getAllUsers();
      return successResponse(res, "Fetch All User", users, STATUS.OK);
    } catch (error) {
      errorResponse(res, error.message, STATUS.BAD_REQUEST);
    }
  }
}

export default new AuthController();
