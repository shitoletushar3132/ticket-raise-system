import express from "express";
import authController from "../controllers/auth.controller.js";
import { authorize, protect } from "../middlewares/auth.js";

const authRouter = express.Router();

authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
authRouter.get("/me", protect, authController.getMe);
authRouter.get(
  "/users",
  protect,
  authorize("admin"),
  authController.getAllUsers
);

export default authRouter;
