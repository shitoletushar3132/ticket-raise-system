import React, { useState, useEffect } from 'react';
import { getTickets, getTicketStats, getAllUsers } from '../api/axios';
import { toast } from 'react-toastify';
import { FaUserShield, FaTicketAlt, FaUsers, FaChartBar } from 'react-icons/fa';
import Container from '../components/ui/Container';
import Card from '../components/ui/Card';
import StatCard from '../components/StatCard';
import TicketCard from '../components/TicketCard';
import Badge from '../components/ui/Badge';
import Loading from '../components/ui/Loading';

const AdminPanel = () => {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [ticketsRes, usersRes, statsRes] = await Promise.all([
        getTickets(),
        getAllUsers(),
        getTicketStats(),
      ]);

      setTickets(ticketsRes.data.data.tickets || []);
      setUsers(usersRes.data.data || []);
      setStats(statsRes.data.data || null);
    } catch (error) {
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading fullScreen text="Loading admin panel..." />;
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <FaChartBar /> },
    { id: 'tickets', label: 'All Tickets', icon: <FaTicketAlt /> },
    { id: 'users', label: 'Users', icon: <FaUsers /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Container>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3 mb-2">
            <FaUserShield className="text-primary-600" />
            Admin Panel
          </h1>
          <p className="text-gray-600">Manage tickets and monitor system activity</p>
        </div>

        {/* Tabs */}
        <Card className="p-2 mb-8">
          <div className="flex gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium text-sm transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </Card>

        {/* Overview Tab */}
        {activeTab === 'overview' && stats && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Tickets"
                value={stats.total}
                icon={<FaTicketAlt />}
                color="blue"
              />
              <StatCard
                title="Open Tickets"
                value={stats.byStatus.open}
                icon={<FaTicketAlt />}
                color="yellow"
              />
              <StatCard
                title="In Progress"
                value={stats.byStatus.inProgress}
                icon={<FaTicketAlt />}
                color="indigo"
              />
              <StatCard
                title="Resolved"
                value={stats.byStatus.resolved}
                icon={<FaTicketAlt />}
                color="green"
              />
            </div>

            {/* Priority Distribution */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Priority Distribution</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 text-center">
                  <p className="text-sm font-medium text-red-700 mb-2">High Priority</p>
                  <p className="text-4xl font-bold text-red-600">{stats.byPriority.high}</p>
                </div>
                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6 text-center">
                  <p className="text-sm font-medium text-yellow-700 mb-2">Medium Priority</p>
                  <p className="text-4xl font-bold text-yellow-600">{stats.byPriority.medium}</p>
                </div>
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 text-center">
                  <p className="text-sm font-medium text-blue-700 mb-2">Low Priority</p>
                  <p className="text-4xl font-bold text-blue-600">{stats.byPriority.low}</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Tickets Tab */}
        {activeTab === 'tickets' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              All Tickets ({tickets.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tickets.map((ticket) => (
                <TicketCard key={ticket._id} ticket={ticket} />
              ))}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <Card className="overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Registered Users ({users.length})
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={user.role === 'admin' ? 'warning' : 'info'} size="sm">
                          {user.role}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{user.department}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </Container>
    </div>
  );
};

export default AdminPanel;