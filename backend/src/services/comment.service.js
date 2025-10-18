import commentRepository from "../repositories/comment.repository.js";
import ticketRepository from "../repositories/ticketRepository.js";

class CommentService {
  async addComment(ticketId, userId, userRole, message) {
    const ticket = await ticketRepository.findById(ticketId);
    if (!ticket) {
      throw new Error("Ticket not found");
    }

    if (
      userRole !== "admin" &&
      ticket.createdBy._id.toString() !== userId.toString()
    ) {
      throw new Error("Not authorized to comment on this ticket");
    }

    const comment = await commentRepository.create({
      ticket: ticketId,
      user: userId,
      message,
    });

    return comment;
  }

  async getCommentsByTicket(ticketId, userId, userRole) {
    const ticket = await ticketRepository.findById(ticketId);
    if (!ticket) {
      throw new Error("Ticket not found");
    }

    if (
      userRole !== "admin" &&
      ticket.createdBy._id.toString() !== userId.toString()
    ) {
      throw new Error("Not authorized to view comments for this ticket");
    }

    return await commentRepository.findByTicketId(ticketId);
  }

  async deleteComment(commentId, userId, userRole) {
    const comment = await commentRepository.findById(commentId);
    if (!comment) {
      throw new Error("Comment not found");
    }

    if (
      userRole !== "admin" &&
      comment.user._id.toString() !== userId.toString()
    ) {
      throw new Error("Not authorized to delete this comment");
    }

    return await commentRepository.delete(commentId);
  }
}

export default new CommentService();
