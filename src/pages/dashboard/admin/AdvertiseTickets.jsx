import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosSecure from '../../../lib/axios';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../../components/common/LoadingSpinner';

const AdvertiseTickets = () => {
  const queryClient = useQueryClient();

  const { data: allTickets = [], isLoading } = useQuery({
    queryKey: ['admin-tickets'],
    queryFn: async () => {
      const res = await axiosSecure.get('/api/admin/tickets');
      return res.data;
    }
  });

  const toggleAdvertiseMutation = useMutation({
    mutationFn: async ({ id }) => {
      const res = await axiosSecure.patch(`/api/admin/tickets/${id}/advertise`);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Ticket advertisement status updated!');
      queryClient.invalidateQueries({ queryKey: ['admin-tickets'] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to update advertisement status. Limit 6 may be reached.');
    }
  });

  if (isLoading) return <LoadingSpinner />;

  // Filter client-side to only show tickets with verificationStatus === 'approved'
  const approvedTickets = allTickets.filter(
    (ticket) => ticket.verificationStatus === 'approved'
  );

  const advertisedCount = approvedTickets.filter(ticket => ticket.isAdvertised).length;
  const isLimitReached = advertisedCount >= 6;

  const handleToggleAdvertise = (ticket) => {
    if (!ticket.isAdvertised && isLimitReached) {
      toast.error('Maximum 6 tickets can be advertised.');
      return;
    }
    toggleAdvertiseMutation.mutate({ id: ticket._id });
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Advertise Tickets</h2>
        <div className="badge badge-lg badge-neutral">
          {advertisedCount}/6 tickets advertised
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Image</th>
              <th>Title</th>
              <th>Route</th>
              <th>Type</th>
              <th>Price</th>
              <th>Advertised</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {approvedTickets.map((ticket, index) => (
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
                <td>{ticket.from} &rarr; {ticket.to}</td>
                <td className="capitalize">{ticket.transportType}</td>
                <td>${ticket.price}</td>
                <td>
                  {ticket.isAdvertised ? (
                    <span className="text-green-500 font-bold text-xl">✓</span>
                  ) : (
                    <span className="text-red-500 font-bold text-xl">✗</span>
                  )}
                </td>
                <td>
                  {ticket.isAdvertised ? (
                    <button 
                      onClick={() => handleToggleAdvertise(ticket)}
                      className="btn btn-warning btn-sm"
                      disabled={toggleAdvertiseMutation.isPending}
                    >
                      Unadvertise
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleToggleAdvertise(ticket)}
                      className="btn btn-success btn-sm"
                      disabled={toggleAdvertiseMutation.isPending || isLimitReached}
                    >
                      Advertise
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {approvedTickets.length === 0 && (
          <div className="text-center py-10 text-gray-500">No approved tickets found to advertise.</div>
        )}
      </div>
    </div>
  );
};

export default AdvertiseTickets;
