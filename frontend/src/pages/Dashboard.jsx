import React, { useState, useEffect, useContext } from "react";
import { getAssignedTickets, getTickets, getTicketStats } from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import {
  FaTicketAlt,
  FaFolderOpen,
  FaCheckCircle,
  FaExclamationCircle,
  FaArrowRight,
} from "react-icons/fa";
import Container from "../components/ui/Container";
import StatCard from "../components/StatCard";
import TicketCard from "../components/TicketCard";
import Loading from "../components/ui/Loading";
import Badge from "../components/ui/Badge";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [assignTickets, setAssignTickets] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const ticketsResponse = await getTickets();
      console.log(ticketsResponse);
      setTickets(ticketsResponse?.data?.data?.tickets || []);

      const assignedTicketResponse = await getAssignedTickets();
      setAssignTickets(assignedTicketResponse?.data?.data || []);

      if (user.role === "admin") {
        const statsResponse = await getTicketStats();
        setStats(statsResponse.data.data || null);
      }
    } catch (error) {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading fullScreen text="Loading dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Container>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.name}! 👋
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your tickets today
          </p>
        </div>

        {/* Stats Grid - Admin Only */}
        {user.role === "admin" && stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Tickets"
              value={stats.total}
              icon={<FaTicketAlt />}
              color="blue"
            />
            <StatCard
              title="Open Tickets"
              value={stats.byStatus.open}
              icon={<FaFolderOpen />}
              color="yellow"
            />
            <StatCard
              title="In Progress"
              value={stats.byStatus.inProgress}
              icon={<FaExclamationCircle />}
              color="indigo"
            />
            <StatCard
              title="Resolved"
              value={stats.byStatus.resolved}
              icon={<FaCheckCircle />}
              color="green"
            />
          </div>
        )}

        {/* Assigned Tickets */}
        <div>
          <div className="flex justify-between">
            <h2 className="text-xl font-semibold text-gray-900 my-6">
              Assigned Tickets ({assignTickets.length})
            </h2>

            <div className="my-auto">
              <Badge variant="default" size="sm">
                <p
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => {
                    navigate("/tickets");
                  }}
                >
                  See All <FaArrowRight />
                </p>
              </Badge>
            </div>
          </div>
          {assignTickets.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <FaTicketAlt className="mx-auto text-5xl text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg mb-2">No tickets found</p>
              <p className="text-gray-400 text-sm">
                No tickets are currently assigned to you
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {assignTickets.slice(0, 3).map((ticket) => (
                <TicketCard key={ticket._id} ticket={ticket} />
              ))}
            </div>
          )}
        </div>

        {/* Recent Tickets */}
        <div>
          <div className="flex justify-between">
            <h2 className="text-xl font-semibold text-gray-900 my-6">
              Recent Tickets
            </h2>

            <div className="my-auto">
              <Badge variant="default" size="sm">
                <p
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => {
                    navigate("/assigned-tickets");
                  }}
                >
                  See All <FaArrowRight />
                </p>
              </Badge>
            </div>
          </div>

          {tickets.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <FaTicketAlt className="mx-auto text-5xl text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg mb-2">No tickets found</p>
              <p className="text-gray-400 text-sm">
                Create your first ticket to get started
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tickets.slice(0, 3).map((ticket) => (
                <TicketCard key={ticket._id} ticket={ticket} />
              ))}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default Dashboard;
