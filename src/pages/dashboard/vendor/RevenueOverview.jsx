import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosSecure from '../../../lib/axios';
import { useAuth } from '../../../providers/AuthProvider';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FaTicketAlt, FaCheckCircle, FaMoneyBillWave } from 'react-icons/fa';

const PIE_COLORS = ['#0d9488', '#6366f1', '#ef4444', '#22c55e'];

const RevenueOverview = () => {
  const { user } = useAuth();

  const { data: tickets = [], isLoading: isLoadingTickets } = useQuery({
    queryKey: ['vendor-tickets-overview', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get('/api/tickets/vendor/my-tickets');
      return res.data;
    },
    enabled: !!user?.email,
  });

  const { data: bookings = [], isLoading: isLoadingBookings } = useQuery({
    queryKey: ['vendor-bookings-overview', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get('/api/bookings/vendor-requests');
      return res.data;
    },
    enabled: !!user?.email,
  });

  const stats = useMemo(() => {
    let totalTicketsSold = 0;
    let totalRevenue = 0;
    const revenuePerTicket = {};
    const statusCounts = { pending: 0, accepted: 0, rejected: 0, paid: 0 };

    bookings.forEach(b => {
      if (statusCounts[b.status] !== undefined) {
        statusCounts[b.status]++;
      }
      if (b.status === 'paid') {
        totalTicketsSold += b.quantity;
        totalRevenue += b.totalPrice;
        
        if (revenuePerTicket[b.ticketTitle]) {
          revenuePerTicket[b.ticketTitle] += b.totalPrice;
        } else {
          revenuePerTicket[b.ticketTitle] = b.totalPrice;
        }
      }
    });

    const barChartData = Object.keys(revenuePerTicket).map(title => ({
      name: title,
      revenue: revenuePerTicket[title]
    }));

    const pieChartData = [
      { name: 'Pending', value: statusCounts.pending },
      { name: 'Accepted', value: statusCounts.accepted },
      { name: 'Rejected', value: statusCounts.rejected },
      { name: 'Paid', value: statusCounts.paid },
    ].filter(d => d.value > 0);

    return {
      totalTicketsAdded: tickets.length,
      totalTicketsSold,
      totalRevenue,
      barChartData,
      pieChartData
    };
  }, [tickets, bookings]);

  if (isLoadingTickets || isLoadingBookings) return <LoadingSpinner />;

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold">Revenue Overview</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="stat bg-base-100 shadow-xl rounded-box border border-base-200">
          <div className="stat-figure text-primary">
            <FaTicketAlt className="text-3xl" />
          </div>
          <div className="stat-title">Total Tickets Added</div>
          <div className="stat-value text-primary">{stats.totalTicketsAdded}</div>
        </div>
        
        <div className="stat bg-base-100 shadow-xl rounded-box border border-base-200">
          <div className="stat-figure text-secondary">
            <FaCheckCircle className="text-3xl" />
          </div>
          <div className="stat-title">Total Tickets Sold</div>
          <div className="stat-value text-secondary">{stats.totalTicketsSold}</div>
        </div>

        <div className="stat bg-base-100 shadow-xl rounded-box border border-base-200">
          <div className="stat-figure text-success">
            <FaMoneyBillWave className="text-3xl" />
          </div>
          <div className="stat-title">Total Revenue</div>
          <div className="stat-value text-success">${stats.totalRevenue.toFixed(2)}</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <div className="bg-base-100 shadow-xl rounded-box p-6 border border-base-200">
          <h2 className="text-xl font-bold mb-6 text-center">Revenue Per Ticket (Paid)</h2>
          {stats.barChartData.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.barChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${value}`} />
                  <Legend />
                  <Bar dataKey="revenue" fill="#3b82f6" name="Revenue ($)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center text-gray-500">
              No revenue data yet.
            </div>
          )}
        </div>

        <div className="bg-base-100 shadow-xl rounded-box p-6 border border-base-200">
          <h2 className="text-xl font-bold mb-6 text-center">Booking Status Distribution</h2>
          {stats.pieChartData.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {stats.pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center text-gray-500">
              No bookings yet.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default RevenueOverview;
