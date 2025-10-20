import React from "react";
import { useNavigate } from "react-router-dom";
import { FaClock, FaUser } from "react-icons/fa";
import Card from "./ui/Card";
import Badge from "./ui/Badge";

const TicketCard = ({ ticket }) => {
  const navigate = useNavigate();

  const getPriorityVariant = (priority) => {
    const variants = {
      High: "danger",
      Medium: "warning",
      Low: "info",
    };
    return variants[priority] || "default";
  };

  const getStatusVariant = (status) => {
    const variants = {
      Open: "info",
      "In Progress": "warning",
      Resolved: "success",
      Closed: "default",
    };
    return variants[status] || "default";
  };

  return (
    <Card hover onClick={() => navigate(`/tickets/${ticket._id}`)}>
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-base font-semibold text-gray-900 flex-1 pr-2 line-clamp-2">
            {ticket.title}
          </h3>
          <Badge variant={getPriorityVariant(ticket.priority)} size="sm">
            {ticket.priority}
          </Badge>
        </div>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {ticket.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="default" size="sm">
            {ticket.department}
          </Badge>
          <Badge variant={getStatusVariant(ticket.status)} size="sm">
            {ticket.status}
          </Badge>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1">
            <FaUser className="text-gray-400" />
            <span>{ticket.createdBy?.name || "Unknown"}</span>
          </div>
          <div className="flex items-center gap-1">
            <FaClock className="text-gray-400" />
            <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {ticket.assignedTo && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-600">
              Assigned to:{" "}
              <span className="font-medium text-gray-900">
                {ticket.assignedTo.name}
              </span>
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default TicketCard;
