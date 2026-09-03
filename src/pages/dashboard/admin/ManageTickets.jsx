import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosSecure from '../../../lib/axios';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../../components/common/LoadingSpinner';

const ManageTickets = () => {
  const queryClient = useQueryClient();

  const { data: tickets = [], isLoading } = useQuery({
    queryKey: ['admin-tickets'],
    queryFn: async () => {
      const res = await axiosSecure.get('/api/admin/tickets');
      return res.data;
    }
  });

  const approveMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.patch(`/api/admin/tickets/${id}/approve`);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Ticket approved successfully!');
      queryClient.invalidateQueries({ queryKey: ['admin-tickets'] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to approve ticket');
    }
  });

  const rejectMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.patch(`/api/admin/tickets/${id}/reject`);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Ticket rejected successfully!');
      queryClient.invalidateQueries({ queryKey: ['admin-tickets'] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to reject ticket');
    }
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Manage Tickets</h2>
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Image</th>
              <th>Title</th>
              <th>Vendor</th>
              <th>Route</th>
              <th>Type</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket, index) => (
              <tr key={ticket._id}>
                <th>{index + 1}</th>
                <td>
                  <div className="avatar">
                    <div className="w-12 h-12 rounded">
                      <img src={ticket.image || 'https://via.placeholder.com/50'} alt="Thumbnail" />
                    </div>
                  </div>
                </td>
                <td>{ticket.title}</td>
                <td>{ticket.vendorName || ticket.vendorEmail}</td>
                <td>{ticket.from} &rarr; {ticket.to}</td>
                <td className="capitalize">{ticket.transportType}</td>
                <td>${ticket.price}</td>
                <td>
                  <div className={`badge ${
                    ticket.verificationStatus === 'approved' ? 'badge-success' : 
                    ticket.verificationStatus === 'rejected' ? 'badge-error' : 'badge-warning'
                  }`}>
                    {ticket.verificationStatus || 'pending'}
                  </div>
                </td>
                <td>
                  <div className="flex gap-2">
                    {ticket.verificationStatus !== 'approved' && (
                      <button 
                        onClick={() => approveMutation.mutate(ticket._id)}
                        className="btn btn-success btn-sm"
                        disabled={approveMutation.isPending}
                      >
                        Approve
                      </button>
                    )}
                    {ticket.verificationStatus !== 'rejected' && (
                      <button 
                        onClick={() => rejectMutation.mutate(ticket._id)}
                        className="btn btn-error btn-sm"
                        disabled={rejectMutation.isPending}
                      >
                        Reject
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {tickets.length === 0 && (
          <div className="text-center py-10 text-gray-500">No tickets found.</div>
        )}
      </div>
    </div>
  );
};

export default ManageTickets;
