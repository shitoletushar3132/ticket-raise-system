import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getTicket,
  updateTicketStatus,
  assignTicket,
  deleteTicket,
  getAllUsers,
} from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import {
  FaArrowLeft,
  FaUser,
  FaClock,
  FaBuilding,
  FaTrash,
  FaLink,
} from "react-icons/fa";
import Container from "../components/ui/Container";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Select from "../components/ui/Select";
import CommentSection from "../components/CommentSection";
import Loading from "../components/ui/Loading";

const TicketDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [ticket, setTicket] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const statusOptions = [
    { value: "Open", label: "Open" },
    { value: "In Progress", label: "In Progress" },
    { value: "Resolved", label: "Resolved" },
    { value: "Closed", label: "Closed" },
  ];

  useEffect(() => {
    fetchTicket();
    if (user.role === "admin") {
      fetchUsers();
    }
  }, [id]);

  const fetchTicket = async () => {
    try {
      const response = await getTicket(id);
      setTicket(response.data.data);
    } catch (error) {
      toast.error("Failed to load ticket");
      navigate("/tickets");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await getAllUsers();
      setUsers(response.data.data || []);
    } catch (error) {
      console.error("Failed to load users");
    }
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setUpdating(true);
    try {
      await updateTicketStatus(id, newStatus);
      toast.success("Status updated successfully");
      fetchTicket();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  const handleAssign = async (e) => {
    const userId = e.target.value;
    if (!userId) return;

    setUpdating(true);
    try {
      await assignTicket(id, userId);
      toast.success("Ticket assigned successfully");
      fetchTicket();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to assign ticket");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this ticket?")) {
      try {
        await deleteTicket(id);
        toast.success("Ticket deleted successfully");
        navigate("/tickets");
      } catch (error) {
        toast.error("Failed to delete ticket");
      }
    }
  };

  const getPriorityVariant = (priority) => {
    const variants = { High: "danger", Medium: "warning", Low: "info" };
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

  if (loading) {
    return <Loading fullScreen text="Loading ticket details..." />;
  }

  if (!ticket) {
    return <div>Ticket not found</div>;
  }

  const userOptions = [
    { value: "", label: "Select User" },
    ...users.map((u) => ({
      value: u._id,
      label: `${u.name} (${u.department})`,
    })),
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Container maxWidth="max-w-5xl">
        <Button
          variant="ghost"
          size="sm"
          icon={<FaArrowLeft />}
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          Back
        </Button>

        <Card className="overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-blue-600 px-8 py-8">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-white mb-4">
                  {ticket.title}
                </h1>
                <div className="flex flex-wrap gap-3 text-sm text-blue-100">
                  <div className="flex items-center gap-2">
                    <FaUser />
                    <span>
                      Created by:{" "}
                      <strong className="text-white">
                        {ticket.createdBy?.name}
                      </strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaBuilding />
                    <span>
                      Department:{" "}
                      <strong className="text-white">
                        {ticket.department}
                      </strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaClock />
                    <span>{new Date(ticket.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Badge variant={getPriorityVariant(ticket.priority)} size="lg">
                  {ticket.priority} Priority
                </Badge>
                <Badge variant={getStatusVariant(ticket.status)} size="lg">
                  {ticket.status}
                </Badge>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-8">
            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Description
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {ticket.description}
              </p>
            </div>

            {/* Attachment */}
            {ticket.attachment && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Attachment
                </h3>
                <a
                  href={ticket.attachment}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
                >
                  <FaLink />
                  View Attachment
                </a>
              </div>
            )}

            {/* Assigned To */}
            {ticket.assignedTo && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Assigned To
                </h3>
                <div className="flex items-center gap-2 text-gray-700">
                  <FaUser className="text-gray-400" />
                  <span>
                    {ticket.assignedTo.name} ({ticket.assignedTo.email})
                  </span>
                </div>
              </div>
            )}

            {/* Admin Actions */}
            {user.role === "admin" && (
              <Card className="p-6 bg-gray-50 border-2 border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Admin Actions
                </h3>
                <div className="space-y-4">
                  <Select
                    label="Update Status"
                    name="status"
                    value={ticket.status}
                    onChange={handleStatusChange}
                    options={statusOptions}
                    disabled={updating}
                  />

                  <Select
                    label="Assign To"
                    name="assignedTo"
                    value={ticket.assignedTo?._id || ""}
                    onChange={handleAssign}
                    options={userOptions}
                    disabled={updating}
                  />

                  <Button
                    variant="danger"
                    size="md"
                    icon={<FaTrash />}
                    onClick={handleDelete}
                    fullWidth
                  >
                    Delete Ticket
                  </Button>
                </div>
              </Card>
            )}

            {/* Comments */}
            <CommentSection ticketId={id} />
          </div>
        </Card>
      </Container>
    </div>
  );
};

export default TicketDetails;
