import Comment from "../models/comment.model.js";
class CommentRepository {
  async create(commentData) {
    const comment = await Comment.create(commentData);
    return await comment.populate("user", "name email role");
  }

  async findByTicketId(ticketId) {
    return await Comment.find({ ticket: ticketId })
      .populate("user", "name email role")
      .sort("createdAt");
  }

  async findById(id) {
    return await Comment.findById(id).populate("user", "name email role");
  }

  async delete(id) {
    return await Comment.findByIdAndDelete(id);
  }

  async deleteByTicketId(ticketId) {
    return await Comment.deleteMany({ ticket: ticketId });
  }

  async countByTicket(ticketId) {
    return await Comment.countDocuments({ ticket: ticketId });
  }
}

export default new CommentRepository();
