import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTicket } from "../api/axios";
import { toast } from "react-toastify";
import {
  FaPlusCircle,
  FaFileAlt,
  FaExclamationCircle,
  FaBuilding,
} from "react-icons/fa";
import Container from "../components/ui/Container";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Textarea from "../components/ui/Textarea";
import Button from "../components/ui/Button";

const CreateTicket = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    department: "IT",
    attachment: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const priorityOptions = [
    { value: "Low", label: "Low" },
    { value: "Medium", label: "Medium" },
    { value: "High", label: "High" },
  ];

  const departmentOptions = [
    { value: "IT", label: "IT" },
    { value: "HR", label: "HR" },
    { value: "Finance", label: "Finance" },
    { value: "Operations", label: "Operations" },
    { value: "Marketing", label: "Marketing" },
    { value: "Other", label: "Other" },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createTicket(formData);
      toast.success("Ticket created successfully!");
      navigate("/tickets");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create ticket");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Container maxWidth="max-w-3xl">
        <Card className="overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-blue-600 px-8 py-10 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mb-4">
              <FaPlusCircle className="text-3xl text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Create New Ticket
            </h1>
            <p className="text-blue-100">
              Describe your issue and we'll help you resolve it
            </p>
          </div>

          {/* Form */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Ticket Title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Brief description of the issue"
                icon={<FaFileAlt />}
                required
              />

              <Textarea
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide detailed information about the issue"
                rows={6}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Select
                  label="Priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  options={priorityOptions}
                  icon={<FaExclamationCircle />}
                  required
                />

                <Select
                  label="Department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  options={departmentOptions}
                  icon={<FaBuilding />}
                  required
                />
              </div>

              <Input
                label="Attachment URL (Optional)"
                type="text"
                name="attachment"
                value={formData.attachment}
                onChange={handleChange}
                placeholder="Enter image or document URL"
              />

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  size="md"
                  fullWidth
                  onClick={() => navigate("/tickets")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  fullWidth
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create Ticket"}
                </Button>
              </div>
            </form>
          </div>
        </Card>
      </Container>
    </div>
  );
};

export default CreateTicket;
