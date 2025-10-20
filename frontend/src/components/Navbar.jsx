import React, { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  FaTicketAlt,
  FaSignOutAlt,
  FaUserCircle,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import Button from "./ui/Button";
import Badge from "./ui/Badge";

const Navbar = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: "/dashboard", label: "Dashboard", show: true },
    { path: "/tickets", label: "My Tickets", show: true },
    { path: "/create-ticket", label: "Create Ticket", show: true },
    { path: "/admin", label: "Admin Panel", show: user?.role === "admin" },
    { path: "/assigned-tickets", label: "assigned Ticktes", show: true },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-primary-600 font-bold text-xl"
          >
            <FaTicketAlt className="text-2xl" />
            <span className="hidden sm:inline">Ticket System</span>
          </Link>

          {user && (
            <>
              {/* Desktop Menu */}
              <div className="hidden md:flex items-center gap-6">
                {navLinks.map((link) =>
                  link.show ? (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`text-sm font-medium transition-colors ${
                        isActive(link.path)
                          ? "text-primary-600"
                          : "text-gray-700 hover:text-primary-600"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ) : null
                )}

                {/* User Info */}
                <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
                  <div className="flex items-center gap-2 text-sm">
                    <FaUserCircle className="text-gray-400 text-xl" />
                    <div className="hidden lg:block">
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <Badge variant="primary" size="sm">
                        {user.role}
                      </Badge>
                    </div>
                  </div>

                  <Button
                    variant="danger"
                    size="sm"
                    onClick={handleLogout}
                    icon={<FaSignOutAlt />}
                  >
                    <span className="hidden lg:inline">Logout</span>
                  </Button>
                </div>
              </div>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden text-gray-700 text-2xl"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <FaTimes /> : <FaBars />}
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        {user && mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) =>
                link.show ? (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      isActive(link.path)
                        ? "bg-primary-50 text-primary-600"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {link.label}
                  </Link>
                ) : null
              )}
              <div className="px-4 py-2 border-t border-gray-200 mt-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {user.name}
                    </p>
                    <Badge variant="primary" size="sm">
                      {user.role}
                    </Badge>
                  </div>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={handleLogout}
                    icon={<FaSignOutAlt />}
                  >
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
