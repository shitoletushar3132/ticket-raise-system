import express from "express";
import commentController from "../controllers/comment.controller.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(protect, commentController.getComments)
  .post(protect, commentController.addComment);

router.route("/:id").delete(protect, commentController.deleteComment);

export default router;
