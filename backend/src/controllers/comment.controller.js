import commentService from "../services/comment.service.js";
import { errorResponse, successResponse } from "../utils/ApiResponse.js";
import logger from "../utils/logger.js";
import { STATUS } from "../utils/statusCodes.js";

class CommentController {
  async addComment(req, res) {
    try {
      const { message } = req.body;
      if (!message) {
        return errorResponse(res, "Message Field Required", STATUS.BAD_REQUEST);
      }
      const comment = await commentService.addComment(
        req.params.ticketId,
        req.user.id,
        req.user.role,
        message
      );

      return successResponse(res, "comment added Successfully", comment);
    } catch (error) {
      logger.error(error);
      return errorResponse(res, error.message, STATUS.FORBIDDEN);
    }
  }

  async getComments(req, res) {
    try {
      const comments = await commentService.getCommentsByTicket(
        req.params.ticketId,
        req.user.id,
        req.user.role
      );

      return successResponse(res, "Comments Fetch Successfully", {
        count: comments.length,
        comments,
      });
    } catch (error) {
      logger.error(error);
      return errorResponse(res, error.message, STATUS.FORBIDDEN);
    }
  }

  async deleteComment(req, res) {
    try {
      await commentService.deleteComment(
        req.params.id,
        req.user.id,
        req.user.role
      );
      return successResponse(res, "Comment deleted successfully");
    } catch (error) {
      logger.error(error);
      return errorResponse(res, error.message, STATUS.FORBIDDEN);
    }
  }
}

export default new CommentController();
