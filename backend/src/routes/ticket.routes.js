import express from "express";
import { authorize, protect } from "../middlewares/auth.js";
import ticketController from "../controllers/ticket.controller.js";

const router = express.Router();

// Comment routes (nested)
import commentRouter from "./comment.routes.js";
router.use("/:ticketId/comments", commentRouter);

router.get("/stats", protect, authorize("admin"), ticketController.getStats);

router.get("/assigned", protect, ticketController.getAssignedTickets);

router
  .route("/")
  .get(protect, ticketController.getTickets)
  .post(protect, ticketController.createTicket);

router
  .route("/:id")
  .get(protect, ticketController.getTicket)
  .put(protect, authorize("admin"), ticketController.updateTicket)
  .delete(protect, authorize("admin"), ticketController.deleteTicket);

router.put(
  "/:id/assign",
  protect,
  authorize("admin"),
  ticketController.assignTicket
);

router.put(
  "/:id/status",
  protect,
  authorize("admin"),
  ticketController.updateStatus
);

export default router;
