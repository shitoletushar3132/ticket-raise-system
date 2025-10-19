import ticketService from "../services/ticket.service.js";
import { errorResponse, successResponse } from "../utils/ApiResponse.js";
import logger from "../utils/logger.js";
import { STATUS } from "../utils/statusCodes.js";
import { createTicketValidation } from "../validations/ticket.validation.js";

class TicketController {
  async createTicket(req, res) {
    try {
      const { error } = createTicketValidation.validate(req.body, {
        abortEarly: true,
      });
      if (error) {
        errorResponse(res, error.details[0].message, STATUS.BAD_REQUEST);
      }
      const ticket = await ticketService.createTicket(req.body, req.user.id);
      return successResponse(
        res,
        "Ticket Rise Successfully",
        ticket,
        STATUS.CREATED
      );
    } catch (error) {
      logger.error(error);
      errorResponse(res, error.message, STATUS.BAD_REQUEST);
    }
  }

  async getTickets(req, res) {
    try {
      const tickets = await ticketService.getAllTickets(
        req.user.role,
        req.user.id
      );

      return successResponse(
        res,
        "Tickets Fetch Successfully",
        {
          count: tickets.length,
          tickets,
        },
        STATUS.OK
      );
    } catch (error) {
      logger.error(error);
      errorResponse(res, error.message, STATUS.BAD_REQUEST);
    }
  }

  async getTicket(req, res) {
    try {
      const ticket = await ticketService.getTicketById(
        req.params.id,
        req.user.id,
        req.user.role
      );

      return successResponse(
        res,
        `Ticket Fetch Successfully for id ${req.params.id}`,
        ticket,
        STATUS.OK
      );
    } catch (error) {
      logger.error(error);
      const statusCode =
        error.message === "Ticket not found"
          ? STATUS.NOT_FOUND
          : STATUS.FORBIDDEN;
      errorResponse(res, error.message, statusCode);
    }
  }

  async updateTicket(req, res) {
    try {
      const ticket = await ticketService.updateTicket(
        req.params.id,
        req.body,
        req.user.role
      );
      return successResponse(
        res,
        "Update Ticket Successfully",
        ticket,
        STATUS.OK
      );
    } catch (error) {
      logger.error(error);
      const statusCode =
        error.message === "Ticket not found"
          ? STATUS.NOT_FOUND
          : STATUS.FORBIDDEN;
      errorResponse(res, error.message, statusCode);
    }
  }

  async deleteTicket(req, res) {
    try {
      await ticketService.deleteTicket(req.params.id, req.user.role);
      return successResponse(res, "Ticket deleted successfully");
    } catch (error) {
      logger.error(error);
      const statusCode =
        error.message === "Ticket not found"
          ? STATUS.NOT_FOUND
          : STATUS.FORBIDDEN;
      errorResponse(res, error.message, statusCode);
    }
  }

  async assignTicket(req, res) {
    try {
      const { assignedTo } = req.body;

      if (!assignedTo) {
        return errorResponse(
          res,
          "User Id Required to assign ticket",
          STATUS.BAD_REQUEST
        );
      }

      const ticket = await ticketService.assignTicket(
        req.params.id,
        assignedTo,
        req.user.role
      );
      return successResponse(
        res,
        "Assign ticket Successfully",
        ticket,
        STATUS.OK
      );
    } catch (error) {
      logger.error(error);
      const statusCode =
        error.message === "Ticket not found"
          ? STATUS.NOT_FOUND
          : STATUS.FORBIDDEN;
      errorResponse(res, error.message, statusCode);
    }
  }

  async updateStatus(req, res) {
    try {
      const { status } = req.body;
      if (!status) {
        return errorResponse(res, "Status iS required", STATUS.BAD_REQUEST);
      }
      const ticket = await ticketService.updateTicketStatus(
        req.params.id,
        status,
        req.user.role
      );
      return successResponse(
        res,
        "update status Successfully",
        ticket,
        STATUS.OK
      );
    } catch (error) {
      logger.error(error);
      errorResponse(res, error.message, STATUS.FORBIDDEN);
    }
  }

  async getStats(req, res) {
    try {
      const stats = await ticketService.getTicketStatistics();
      return successResponse(res, "Stats of the tickets", stats);
    } catch (error) {
      logger.error(error);
      errorResponse(res, error.message, STATUS.FORBIDDEN);
    }
  }

  async getAssignedTickets(req, res) {
    try {
      const tickets = await ticketService.getAssignedTickets(req.user.id);
      return successResponse(res, "Successfully fetch", tickets);
    } catch (error) {
      logger.error(error);
      errorResponse(res, error.message, STATUS.FORBIDDEN);
    }
  }
}

export default new TicketController();
