import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Add token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const register = (userData) => API.post("/auth/register", userData);
export const login = (credentials) => API.post("/auth/login", credentials);
export const getProfile = () => API.get("/auth/me");
export const getAllUsers = () => API.get("/auth/users");

// Ticket APIs
export const createTicket = (ticketData) => API.post("/tickets", ticketData);
export const getTickets = () => API.get("/tickets");
export const getTicket = (id) => API.get(`/tickets/${id}`);
export const updateTicket = (id, data) => API.put(`/tickets/${id}`, data);
export const deleteTicket = (id) => API.delete(`/tickets/${id}`);
export const assignTicket = (id, assignedTo) =>
  API.put(`/tickets/${id}/assign`, { assignedTo });
export const updateTicketStatus = (id, status) =>
  API.put(`/tickets/${id}/status`, { status });
export const getTicketStats = () => API.get("/tickets/stats");
export const getAssignedTickets = () => API.get("/tickets/assigned");

// Comment APIs
export const addComment = (ticketId, message) =>
  API.post(`/tickets/${ticketId}/comments`, { message });
export const getComments = (ticketId) =>
  API.get(`/tickets/${ticketId}/comments`);
export const deleteComment = (ticketId, commentId) =>
  API.delete(`/tickets/${ticketId}/comments/${commentId}`);

export default API;
