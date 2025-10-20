// src/pages/TicketList.jsx
import React, { useState, useEffect } from "react";
import { getAssignedTickets, getTickets } from "../api/axios";
import { toast } from "react-toastify";
import { FaFilter, FaTicketAlt } from "react-icons/fa";
import Container from "../components/ui/Container";
import Card from "../components/ui/Card";
import Select from "../components/ui/Select";
import TicketCard from "../components/TicketCard";
import Loading from "../components/ui/Loading";

const TicketList = ({ type = "assigned" }) => {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "all",
    priority: "all",
    department: "all",
  });

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "Open", label: "Open" },
    { value: "In Progress", label: "In Progress" },
    { value: "Resolved", label: "Resolved" },
    { value: "Closed", label: "Closed" },
  ];

  const priorityOptions = [
    { value: "all", label: "All Priority" },
    { value: "High", label: "High" },
    { value: "Medium", label: "Medium" },
    { value: "Low", label: "Low" },
  ];

  const departmentOptions = [
    { value: "all", label: "All Departments" },
    { value: "IT", label: "IT" },
    { value: "HR", label: "HR" },
    { value: "Finance", label: "Finance" },
    { value: "Operations", label: "Operations" },
    { value: "Marketing", label: "Marketing" },
    { value: "Other", label: "Other" },
  ];

  useEffect(() => {
    fetchTickets();
  }, [type]);

  useEffect(() => {
    applyFilters();
  }, [filters, tickets]);

  const fetchTickets = async () => {
    try {
      const response =
        type === "assigned" ? await getAssignedTickets() : await getTickets();

      // Handle response differences
      const data =
        type === "assigned" ? response.data.data : response.data.data.tickets;

      setTickets(data || []);
      setFilteredTickets(data || []);
    } catch (error) {
      toast.error("Failed to load tickets");
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...tickets];

    if (filters.status !== "all") {
      filtered = filtered.filter((t) => t.status === filters.status);
    }
    if (filters.priority !== "all") {
      filtered = filtered.filter((t) => t.priority === filters.priority);
    }
    if (filters.department !== "all") {
      filtered = filtered.filter((t) => t.department === filters.department);
    }

    setFilteredTickets(filtered);
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  if (loading) {
    return <Loading fullScreen text="Loading tickets..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Container>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3 mb-2">
              <FaTicketAlt className="text-primary-600" />
              {type === "assigned" ? "Assigned Tickets" : "My Tickets"}
            </h1>
            <p className="text-gray-600">
              Total: {filteredTickets.length} tickets
            </p>
          </div>
        </div>

        {/* Filters */}
        <Card className="p-5 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <FaFilter className="text-gray-500" />
            <span className="font-medium text-gray-700">Filters</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              options={statusOptions}
            />
            <Select
              name="priority"
              value={filters.priority}
              onChange={handleFilterChange}
              options={priorityOptions}
            />
            <Select
              name="department"
              value={filters.department}
              onChange={handleFilterChange}
              options={departmentOptions}
            />
          </div>
        </Card>

        {/* Tickets Grid */}
        {filteredTickets.length === 0 ? (
          <Card className="p-12 text-center">
            <FaTicketAlt className="mx-auto text-5xl text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg mb-2">No tickets found</p>
            <p className="text-gray-400 text-sm">
              Try adjusting your filters or create a new ticket
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTickets.map((ticket) => (
              <TicketCard key={ticket._id} ticket={ticket} />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
};

export default TicketList;
