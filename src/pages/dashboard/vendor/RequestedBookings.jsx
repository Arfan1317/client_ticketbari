import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosSecure from '../../../lib/axios';
import { useAuth } from '../../../providers/AuthProvider';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const RequestedBookings = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['vendor-requests', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get('/api/bookings/vendor-requests');
      return res.data;
    },
    enabled: !!user?.email,
  });

  const acceptMutation = useMutation({
    mutationFn: (id) => axiosSecure.patch(`/api/bookings/${id}/accept`),
    onSuccess: () => {
      toast.success('Booking accepted');
      queryClient.invalidateQueries(['vendor-requests']);
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Failed to accept')
  });

  const rejectMutation = useMutation({
    mutationFn: (id) => axiosSecure.patch(`/api/bookings/${id}/reject`),
    onSuccess: () => {
      toast.success('Booking rejected');
      queryClient.invalidateQueries(['vendor-requests']);
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Failed to reject')
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending': return 'badge-warning';
      case 'accepted': return 'badge-info';
      case 'rejected': return 'badge-error';
      case 'paid': return 'badge-success';
      default: return 'badge-ghost';
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">Requested Bookings</h1>

      {bookings.length === 0 ? (
        <div className="text-center py-10">
          <h2 className="text-2xl text-gray-500">No booking requests found</h2>
        </div>
      ) : (
        <div className="overflow-x-auto bg-base-100 rounded-box shadow">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>User</th>
                <th>Ticket Title</th>
                <th>Quantity</th>
                <th>Total Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id}>
                  <td>
                    <div className="font-bold">{booking.userName}</div>
                    <div className="text-sm opacity-50">{booking.userEmail}</div>
                  </td>
                  <td>{booking.ticketTitle}</td>
                  <td>{booking.quantity}</td>
                  <td className="font-semibold">${booking.totalPrice?.toFixed(2)}</td>
                  <td>
                    <span className={`badge ${getStatusBadge(booking.status)} uppercase text-xs font-semibold`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="flex gap-2">
                    <button 
                      onClick={() => acceptMutation.mutate(booking._id)}
                      className="btn btn-success btn-sm"
                      disabled={booking.status !== 'pending' || acceptMutation.isPending}
                    >
                      Accept
                    </button>
                    <button 
                      onClick={() => rejectMutation.mutate(booking._id)}
                      className="btn btn-error btn-sm"
                      disabled={booking.status !== 'pending' || rejectMutation.isPending}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RequestedBookings;
