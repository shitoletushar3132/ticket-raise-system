import ticketRepository from "../repositories/ticket.repository";

class TicketService {
  async createTicket(ticketData, userId) {
    const ticket = await ticketRepository.create({
      ...ticketData,
      createdBy: userId,
    });

    return await ticketRepository.findById(ticket._id);
  }

  async getAllTickets(userRole, userId) {
    if (userRole === "admin") {
      return await ticketRepository.findAll();
    }
    // Employee sees only their tickets
    return await ticketRepository.findByUserId(userId);
  }

  async getTicketById(ticketId, userId, userRole) {
    const ticket = await ticketRepository.findById(ticketId);

    if (!ticket) {
      throw new Error("Ticket not found");
    }

    // Check authorization
    if (
      userRole !== "admin" &&
      ticket.createdBy._id.toString() !== userId.toString()
    ) {
      throw new Error("Not authorized to access this ticket");
    }

    return ticket;
  }

  async updateTicket(ticketId, updateData, userRole) {
    if (userRole !== "admin") {
      throw new Error("Only admins can update tickets");
    }

    const ticket = await ticketRepository.findById(ticketId);
    if (!ticket) {
      throw new Error("Ticket not found");
    }

    return await ticketRepository.update(ticketId, updateData);
  }

  async deleteTicket(ticketId, userRole) {
    if (userRole !== "admin") {
      throw new Error("Only admins can delete tickets");
    }

    const ticket = await ticketRepository.findById(ticketId);
    if (!ticket) {
      throw new Error("Ticket not found");
    }

    return await ticketRepository.delete(ticketId);
  }

  async assignTicket(ticketId, assignedToId, userRole) {
    if (userRole !== "admin") {
      throw new Error("Only admins can assign tickets");
    }

    return await ticketRepository.update(ticketId, {
      assignedTo: assignedToId,
      status: "In Progress",
    });
  }

  async updateTicketStatus(ticketId, status, userRole) {
    if (userRole !== "admin") {
      throw new Error("Only admins can update ticket status");
    }

    return await ticketRepository.update(ticketId, { status });
  }

  async getTicketStatistics() {
    const total = await ticketRepository.countAll();
    const open = await ticketRepository.countByStatus("Open");
    const inProgress = await ticketRepository.countByStatus("In Progress");
    const resolved = await ticketRepository.countByStatus("Resolved");
    const closed = await ticketRepository.countByStatus("Closed");

    const high = await ticketRepository.countByPriority("High");
    const medium = await ticketRepository.countByPriority("Medium");
    const low = await ticketRepository.countByPriority("Low");

    return {
      total,
      byStatus: {
        open,
        inProgress,
        resolved,
        closed,
      },
      byPriority: {
        high,
        medium,
        low,
      },
    };
  }

  async getTicketsByDepartment(department) {
    return await ticketRepository.findByDepartment(department);
  }

  async getTicketsByStatus(status) {
    return await ticketRepository.findByStatus(status);
  }

  async getAssignedTickets(userId) {
    return await ticketRepository.findByAssignedTo(userId);
  }
}

export default new TicketService();
