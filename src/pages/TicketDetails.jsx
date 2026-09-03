import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import axiosSecure from '../lib/axios';
import { useAuth } from '../providers/AuthProvider';
import CountdownTimer from '../components/common/CountdownTimer';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { FaMapMarkerAlt, FaCheckCircle, FaUser, FaEnvelope, FaTicketAlt, FaClock } from 'react-icons/fa';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const TicketDetails = () => {
  const { id } = useParams();
  const { user } = useAuth() || { user: null };
  const navigate = useNavigate();
  const [bookingQuantity, setBookingQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: ticket, isLoading, refetch } = useQuery({
    queryKey: ['ticket', id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/api/tickets/${id}`);
      return res.data;
    }
  });

  const bookMutation = useMutation({
    mutationFn: async (bookingData) => {
      const res = await axiosSecure.post('/api/bookings', bookingData);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Booking successful! Check your dashboard for status.');
      setIsModalOpen(false);
      setBookingQuantity(1);
      refetch();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to book ticket');
    }
  });

  if (isLoading) return <LoadingSpinner />;

  if (!ticket) {
    return (
      <div className="min-h-[70vh] flex justify-center items-center">
        <h2 className="text-2xl font-bold">Ticket not found</h2>
      </div>
    );
  }

  const departureDateTime = new Date(`${ticket.departureDate?.split('T')[0]}T${ticket.departureTime}`);
  const isDeparturePassed = departureDateTime < new Date();
  const canBook = ticket.quantity > 0 && !isDeparturePassed;
  const totalPrice = ticket.price * bookingQuantity;

  const handleBook = (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to book a ticket');
      navigate('/login');
      return;
    }

    if (bookingQuantity < 1 || bookingQuantity > ticket.quantity) {
      toast.error(`Please enter a quantity between 1 and ${ticket.quantity}`);
      return;
    }

    const bookingData = {
      userId: user.authId || user._id,
      userName: user.name,
      userEmail: user.email,
      ticketId: ticket._id,
      ticketTitle: ticket.title,
      ticketImage: ticket.image,
      from: ticket.from,
      to: ticket.to,
      unitPrice: ticket.price,
      quantity: bookingQuantity,
      totalPrice: ticket.price * bookingQuantity,
      departureDate: ticket.departureDate,
      departureTime: ticket.departureTime,
      vendorId: ticket.vendorId,
    };

    bookMutation.mutate(bookingData);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Left Column - Image & Vendor */}
        <div className="space-y-6">
          <figure className="relative rounded-2xl overflow-hidden shadow-lg h-[400px]">
            <img src={ticket.image} alt={ticket.title} className="w-full h-full object-cover" />
            <div className="absolute top-4 right-4 bg-primary text-white font-bold py-2 px-4 rounded-lg shadow-md capitalize">
              {ticket.transportType}
            </div>
          </figure>
          
          <div className="bg-base-200 p-6 rounded-2xl shadow-sm">
            <h3 className="text-xl font-bold mb-4 border-b pb-2">Vendor Information</h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <FaUser className="text-primary" />
                <span className="font-medium">{ticket.vendorName || 'TicketBari Partner'}</span>
              </div>
              <div className="flex items-center gap-3">
                <FaEnvelope className="text-primary" />
                <span>{ticket.vendorEmail || 'vendor@ticketbari.com'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="space-y-8 bg-base-100 p-6 rounded-2xl shadow-sm border border-base-200">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{ticket.title}</h1>
            
            <div className="flex flex-wrap items-center text-xl gap-3 bg-base-200 p-4 rounded-xl">
              <FaMapMarkerAlt className="text-primary text-2xl" />
              <span className="font-bold">{ticket.from}</span>
              <span className="text-base-content/40">→</span>
              <span className="font-bold">{ticket.to}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
              <p className="text-base-content/60 mb-1">Ticket Price</p>
              <p className="text-3xl font-bold text-primary">${ticket.price}</p>
            </div>
            <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
              <p className="text-base-content/60 mb-1">Available Seats</p>
              <p className="text-3xl font-bold">
                {ticket.quantity > 0 ? ticket.quantity : <span className="text-error">Sold Out</span>}
              </p>
            </div>
          </div>

          {/* Departure Info with Live Countdown */}
          <div className="bg-base-200 p-5 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <FaClock className="text-primary" />
              <h3 className="font-bold text-lg">Departure</h3>
            </div>
            <p className="mb-3 text-base-content/70">
              {ticket.departureDate && format(new Date(ticket.departureDate), 'EEEE, MMMM dd, yyyy')} at {ticket.departureTime}
            </p>
            <CountdownTimer departureDate={ticket.departureDate} departureTime={ticket.departureTime} />
          </div>

          {ticket.perks && ticket.perks.length > 0 && (
            <div>
              <h3 className="text-lg font-bold mb-3">Included Perks</h3>
              <div className="flex flex-wrap gap-3">
                {ticket.perks.map((perk, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-base-200 px-4 py-2 rounded-full text-sm font-medium">
                    <FaCheckCircle className="text-success" />
                    {perk}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-6 border-t border-base-200">
            <button 
              className="btn btn-primary w-full btn-lg text-white text-lg"
              onClick={() => setIsModalOpen(true)}
              disabled={!canBook}
            >
              {isDeparturePassed ? 'Departure Time Passed' : ticket.quantity === 0 ? 'Sold Out' : 'Book Now'}
            </button>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box max-w-md">
            <h3 className="font-bold text-2xl mb-4 border-b pb-2 flex items-center gap-2">
              <FaTicketAlt className="text-primary" /> Confirm Booking
            </h3>
            
            <form onSubmit={handleBook} className="space-y-4">
              <div className="space-y-2 bg-base-200 p-4 rounded-lg">
                <p className="font-semibold text-lg">{ticket.title}</p>
                <p className="text-base-content/60">{ticket.from} → {ticket.to}</p>
                <p className="text-base-content/60 text-sm">
                  {ticket.departureDate && format(new Date(ticket.departureDate), 'MMM dd, yyyy')} at {ticket.departureTime}
                </p>
                <p className="text-sm">Unit Price: <span className="font-bold text-primary">${ticket.price}</span></p>
              </div>

              <div className="form-control w-full mt-4">
                <label className="label">
                  <span className="label-text font-bold">Number of Tickets</span>
                </label>
                <input 
                  type="number" 
                  className="input input-bordered w-full" 
                  min="1" 
                  max={ticket.quantity} 
                  value={bookingQuantity}
                  onChange={(e) => setBookingQuantity(Math.max(1, Math.min(ticket.quantity, Number(e.target.value))))}
                  required
                />
                <label className="label">
                  <span className="label-text-alt text-base-content/50">Max available: {ticket.quantity}</span>
                </label>
              </div>

              <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg flex justify-between items-center mt-2">
                <span className="font-bold">Total Price:</span>
                <span className="text-2xl font-bold text-primary">${totalPrice.toFixed(2)}</span>
              </div>

              <div className="modal-action mt-6">
                <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={bookMutation.isPending}
                >
                  {bookMutation.isPending ? <span className="loading loading-spinner loading-sm"></span> : 'Confirm Booking'}
                </button>
              </div>
            </form>
          </div>
          <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}></div>
        </div>
      )}
    </div>
  );
};

export default TicketDetails;
