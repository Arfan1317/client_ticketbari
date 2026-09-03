import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosSecure from '../../../lib/axios';
import { useAuth } from '../../../providers/AuthProvider';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import { FaEdit, FaTrashAlt, FaMapMarkerAlt } from 'react-icons/fa';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';

const MyAddedTickets = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  const { data: tickets = [], isLoading } = useQuery({
    queryKey: ['my-vendor-tickets', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get('/api/tickets/vendor/my-tickets');
      return res.data;
    },
    enabled: !!user?.email,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => axiosSecure.delete(`/api/tickets/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['my-vendor-tickets']);
      toast.success('Ticket deleted successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete ticket');
    }
  });

  const handleDelete = (ticket) => {
    if (ticket.verificationStatus === 'rejected') return;
    
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(ticket._id);
      }
    });
  };

  const openUpdateModal = (ticket) => {
    setSelectedTicket(ticket);
    reset({
      title: ticket.title,
      fromLocation: ticket.from,
      toLocation: ticket.to,
      transportType: ticket.transportType,
      price: ticket.price,
      quantity: ticket.quantity,
      departureDate: ticket.departureDate ? ticket.departureDate.split('T')[0] : '',
      departureTime: ticket.departureTime,
      perks: ticket.perks || [],
    });
    document.getElementById('update_modal').showModal();
  };

  const onUpdateSubmit = async (data) => {
    try {
      setIsUpdating(true);
      
      let imageUrl = selectedTicket.image;
      if (data.image && data.image[0]) {
        const formData = new FormData();
        formData.append('image', data.image[0]);
        const imgbbAPIKey = import.meta.env.VITE_IMGBB_API_KEY;
        const imgRes = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbAPIKey}`, {
          method: 'POST',
          body: formData,
        });
        const imgData = await imgRes.json();
        if (imgData.success) {
          imageUrl = imgData.data.display_url;
        }
      }

      const updatedData = {
        title: data.title,
        from: data.fromLocation,
        to: data.toLocation,
        transportType: data.transportType,
        price: parseFloat(data.price),
        quantity: parseInt(data.quantity),
        departureDate: data.departureDate,
        departureTime: data.departureTime,
        perks: data.perks || [],
        image: imageUrl,
      };

      await axiosSecure.put(`/api/tickets/${selectedTicket._id}`, updatedData);
      
      toast.success('Ticket updated successfully!');
      queryClient.invalidateQueries(['my-vendor-tickets']);
      document.getElementById('update_modal').close();
    } catch (error) {
      console.error(error);
      toast.error('Failed to update ticket');
    } finally {
      setIsUpdating(false);
    }
  };

  const getVerificationBadge = (status) => {
    switch (status) {
      case 'pending': return 'badge-warning';
      case 'approved': return 'badge-success';
      case 'rejected': return 'badge-error';
      default: return 'badge-ghost';
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">My Added Tickets</h1>

      {tickets.length === 0 ? (
        <div className="text-center py-10">
          <h2 className="text-2xl text-gray-500">No tickets added yet</h2>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tickets.map((ticket) => (
            <div key={ticket._id} className="card bg-base-100 shadow-xl border border-base-200">
              <figure className="relative">
                <img src={ticket.image} alt={ticket.title} className="h-48 w-full object-cover" />
                <div className="absolute top-2 right-2">
                  <span className="badge badge-primary uppercase font-bold text-xs p-3">
                    {ticket.transportType}
                  </span>
                </div>
              </figure>
              <div className="card-body p-5">
                <h2 className="card-title text-lg truncate" title={ticket.title}>{ticket.title}</h2>
                
                <div className="flex items-center text-sm text-gray-500 my-1">
                  <FaMapMarkerAlt className="mr-1 text-primary" />
                  <span className="truncate">{ticket.from} → {ticket.to}</span>
                </div>

                <div className="flex justify-between items-center text-sm mt-2">
                  <span className="font-bold text-lg text-success">${ticket.price?.toFixed(2)}</span>
                  <span>Qty: <span className="font-semibold">{ticket.quantity}</span></span>
                </div>

                <div className="mt-3 flex justify-between items-center">
                  <span className="text-xs font-semibold text-gray-500">Status:</span>
                  <span className={`badge ${getVerificationBadge(ticket.verificationStatus)} uppercase text-xs py-2`}>
                    {ticket.verificationStatus || 'pending'}
                  </span>
                </div>

                <div className="card-actions justify-end mt-4 pt-4 border-t border-base-200">
                  <button 
                    onClick={() => openUpdateModal(ticket)}
                    className="btn btn-info btn-sm"
                    disabled={ticket.verificationStatus === 'rejected'}
                  >
                    <FaEdit /> Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(ticket)}
                    className="btn btn-error btn-sm"
                    disabled={ticket.verificationStatus === 'rejected'}
                  >
                    <FaTrashAlt /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Update Modal */}
      <dialog id="update_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box w-11/12 max-w-5xl">
          <h3 className="font-bold text-lg mb-4">Update Ticket</h3>
          <form onSubmit={handleSubmit(onUpdateSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control w-full md:col-span-2">
                <label className="label"><span className="label-text">Ticket Title*</span></label>
                <input type="text" {...register("title", { required: true })} className="input input-bordered w-full input-sm" />
              </div>
              <div className="form-control w-full">
                <label className="label"><span className="label-text">From Location*</span></label>
                <input type="text" {...register("fromLocation", { required: true })} className="input input-bordered w-full input-sm" />
              </div>
              <div className="form-control w-full">
                <label className="label"><span className="label-text">To Location*</span></label>
                <input type="text" {...register("toLocation", { required: true })} className="input input-bordered w-full input-sm" />
              </div>
              <div className="form-control w-full">
                <label className="label"><span className="label-text">Transport Type*</span></label>
                <select {...register("transportType", { required: true })} className="select select-bordered w-full select-sm">
                  <option value="bus">Bus</option>
                  <option value="train">Train</option>
                  <option value="launch">Launch</option>
                  <option value="plane">Plane</option>
                </select>
              </div>
              <div className="form-control w-full">
                <label className="label"><span className="label-text">Price per unit ($)*</span></label>
                <input type="number" step="0.01" min="1" {...register("price", { required: true })} className="input input-bordered w-full input-sm" />
              </div>
              <div className="form-control w-full">
                <label className="label"><span className="label-text">Quantity*</span></label>
                <input type="number" min="1" {...register("quantity", { required: true })} className="input input-bordered w-full input-sm" />
              </div>
              <div className="form-control w-full">
                <label className="label"><span className="label-text">Departure Date*</span></label>
                <input type="date" {...register("departureDate", { required: true })} className="input input-bordered w-full input-sm" />
              </div>
              <div className="form-control w-full">
                <label className="label"><span className="label-text">Departure Time*</span></label>
                <input type="time" {...register("departureTime", { required: true })} className="input input-bordered w-full input-sm" />
              </div>
              <div className="form-control w-full md:col-span-2">
                <label className="label"><span className="label-text">Update Image (Leave empty to keep current)</span></label>
                <input type="file" accept="image/*" {...register("image")} className="file-input file-input-bordered w-full file-input-sm" />
              </div>
              <div className="form-control w-full md:col-span-2">
                <label className="label"><span className="label-text">Perks</span></label>
                <div className="flex flex-wrap gap-2">
                  {['AC', 'WiFi', 'Breakfast', 'Lunch', 'Charging Port', 'Extra Legroom', 'Window Seat'].map(perk => (
                    <label key={perk} className="label cursor-pointer justify-start gap-1 border rounded px-2 py-0 bg-base-200">
                      <input type="checkbox" value={perk} {...register("perks")} className="checkbox checkbox-xs" />
                      <span className="label-text text-xs">{perk}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="modal-action">
              <button type="button" className="btn btn-ghost" onClick={() => document.getElementById('update_modal').close()} disabled={isUpdating}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={isUpdating}>
                {isUpdating ? <span className="loading loading-spinner"></span> : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default MyAddedTickets;
