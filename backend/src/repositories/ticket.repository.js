import Ticket from "../models/ticket.model.js";
class TicketRepository {
  async create(ticketData) {
    return await Ticket.create(ticketData);
  }

  async findById(id) {
    return await Ticket.findById(id)
      .populate("createdBy", "name email department")
      .populate("assignedTo", "name email department");
  }

  async findAll() {
    return await Ticket.find()
      .populate("createdBy", "name email department")
      .populate("assignedTo", "name email department")
      .sort("-createdAt");
  }

  async findByUserId(userId) {
    return await Ticket.find({ createdBy: userId })
      .populate("createdBy", "name email department")
      .populate("assignedTo", "name email department")
      .sort("-createdAt");
  }

  async findByAssignedTo(userId) {
    return await Ticket.find({ assignedTo: userId })
      .populate("createdBy", "name email department")
      .populate("assignedTo", "name email department")
      .sort("-createdAt");
  }

  async update(id, updateData) {
    return await Ticket.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("createdBy", "name email department")
      .populate("assignedTo", "name email department");
  }

  async delete(id) {
    return await Ticket.findByIdAndDelete(id);
  }

  async countByStatus(status) {
    return await Ticket.countDocuments({ status });
  }

  async countByPriority(priority) {
    return await Ticket.countDocuments({ priority });
  }

  async countAll() {
    return await Ticket.countDocuments();
  }

  async findByDepartment(department) {
    return await Ticket.find({ department })
      .populate("createdBy", "name email department")
      .populate("assignedTo", "name email department")
      .sort("-createdAt");
  }

  async findByStatus(status) {
    return await Ticket.find({ status })
      .populate("createdBy", "name email department")
      .populate("assignedTo", "name email department")
      .sort("-createdAt");
  }
}

export default new TicketRepository();
