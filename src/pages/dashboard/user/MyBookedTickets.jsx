import React, { useState } from 'react';
import axiosSecure from '../../../lib/axios';
import { useAuth } from '../../../providers/AuthProvider';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import CountdownTimer from '../../../components/common/CountdownTimer';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { format } from 'date-fns';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { FaMapMarkerAlt } from 'react-icons/fa';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

const CheckoutForm = ({ booking, onSuccess, closeModal }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    try {
      const { data } = await axiosSecure.post('/api/payments/create-payment-intent', {
        totalPrice: booking.totalPrice,
      });

      const clientSecret = data.clientSecret;
      const card = elements.getElement(CardElement);

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card,
          billing_details: {
            name: booking.userName || 'Anonymous',
            email: booking.userEmail || 'unknown@example.com'
          },
        },
      });

      if (result.error) {
        toast.error(result.error.message);
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          await axiosSecure.post('/api/payments/confirm', {
            bookingId: booking._id,
            paymentIntentId: result.paymentIntent.id,
          });
          toast.success('Payment successful!');
          onSuccess();
          closeModal();
        }
      }
    } catch (error) {
      console.error(error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-base-200 p-4 rounded-lg space-y-2">
        <h3 className="font-bold text-lg">{booking.ticketTitle}</h3>
        <p>Quantity: {booking.quantity}</p>
        <p className="font-bold">Total Amount: ${booking.totalPrice.toFixed(2)}</p>
      </div>
      <div className="border p-4 rounded-lg bg-base-100">
        <CardElement options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#424770',
              '::placeholder': { color: '#aab7c4' },
            },
            invalid: { color: '#9e2146' },
          },
        }} />
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <button type="button" className="btn btn-ghost" onClick={closeModal} disabled={loading}>
          Cancel
        </button>
        <button type="submit" className="btn btn-success" disabled={!stripe || loading}>
          {loading ? <span className="loading loading-spinner loading-sm"></span> : `Pay $${booking.totalPrice.toFixed(2)}`}
        </button>
      </div>
    </form>
  );
};

const MyBookedTickets = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedBooking, setSelectedBooking] = useState(null);

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['my-bookings', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get('/api/bookings/my-bookings');
      return res.data;
    },
    enabled: !!user?.email,
  });

  const cancelMutation = useMutation({
    mutationFn: (id) => axiosSecure.delete(`/api/bookings/${id}/cancel`),
    onSuccess: () => {
      toast.success('Booking cancelled successfully');
      queryClient.invalidateQueries(['my-bookings']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
    }
  });

  const handleCancel = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, cancel it!'
    }).then((result) => {
      if (result.isConfirmed) {
        cancelMutation.mutate(id);
      }
    });
  };

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
      <h1 className="text-3xl font-bold">My Booked Tickets</h1>

      {bookings.length === 0 ? (
        <div className="text-center py-10">
          <h2 className="text-2xl text-gray-500">No bookings yet</h2>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => {
            const departureDateTime = new Date(`${booking.departureDate}T${booking.departureTime}`);
            const isPast = departureDateTime < new Date();

            return (
              <div key={booking._id} className="card bg-base-100 shadow-xl overflow-hidden border border-base-200">
                <figure>
                  <img src={booking.ticketImage || 'https://via.placeholder.com/400x200?text=Ticket'} alt={booking.ticketTitle} className="h-40 w-full object-cover" />
                </figure>
                <div className="card-body p-5">
                  <h2 className="card-title text-lg">{booking.ticketTitle}</h2>
                  
                  <div className="flex items-center text-sm text-gray-500 my-2">
                    <FaMapMarkerAlt className="mr-2 text-primary" />
                    {booking.from} <span className="mx-2">→</span> {booking.to}
                  </div>

                  <div className="space-y-1 text-sm">
                    <p><span className="font-semibold">Departure:</span> {format(departureDateTime, 'PP p')}</p>
                    <p><span className="font-semibold">Quantity:</span> {booking.quantity}</p>
                    <p><span className="font-semibold">Total Price:</span> ${booking.totalPrice?.toFixed(2)}</p>
                  </div>

                  <div className="my-2">
                    <span className={`badge ${getStatusBadge(booking.status)} uppercase font-semibold text-xs py-2`}>
                      {booking.status}
                    </span>
                  </div>

                  {booking.status !== 'rejected' && !isPast && (
                     <div className="mt-2">
                        <CountdownTimer departureDate={booking.departureDate} departureTime={booking.departureTime} />
                     </div>
                  )}

                  <div className="card-actions justify-end mt-4">
                    {booking.status === 'pending' && (
                      <button 
                        onClick={() => handleCancel(booking._id)} 
                        className="btn btn-error btn-outline btn-sm w-full"
                        disabled={cancelMutation.isPending}
                      >
                        Cancel Booking
                      </button>
                    )}
                    {booking.status === 'accepted' && (
                      <button 
                        onClick={() => {
                          setSelectedBooking(booking);
                          document.getElementById('payment_modal').showModal();
                        }} 
                        className="btn btn-success btn-sm w-full"
                        disabled={isPast}
                      >
                        Pay Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Payment Modal */}
      <dialog id="payment_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Complete Payment</h3>
          {selectedBooking && (
            <Elements stripe={stripePromise}>
              <CheckoutForm 
                booking={selectedBooking} 
                onSuccess={() => queryClient.invalidateQueries(['my-bookings'])}
                closeModal={() => document.getElementById('payment_modal').close()} 
              />
            </Elements>
          )}
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setSelectedBooking(null)}>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default MyBookedTickets;
