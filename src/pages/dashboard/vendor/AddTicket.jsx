import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../../providers/AuthProvider';
import axiosSecure from '../../../lib/axios';
import toast from 'react-hot-toast';

const AddTicket = () => {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const imgbbAPIKey = import.meta.env.VITE_IMGBB_API_KEY;

  const onSubmit = async (data) => {
    if (user?.isFraud) {
      toast.error('You are marked as fraud and cannot add tickets.');
      return;
    }

    try {
      setIsUploading(true);
      
      // Handle Image Upload
      let imageUrl = '';
      if (data.image && data.image[0]) {
        const formData = new FormData();
        formData.append('image', data.image[0]);
        
        const imgRes = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbAPIKey}`, {
          method: 'POST',
          body: formData,
        });
        const imgData = await imgRes.json();
        if (imgData.success) {
          imageUrl = imgData.data.display_url;
        } else {
          throw new Error('Image upload failed');
        }
      }

      // Prepare Ticket Data
      const ticketData = {
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
        vendorId: user?.authId || user?._id,
        vendorName: user?.name,
        vendorEmail: user?.email,
      };

      await axiosSecure.post('/api/tickets', ticketData);
      
      toast.success('Ticket added successfully! Pending verification.');
      reset();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message || 'Failed to add ticket');
    } finally {
      setIsUploading(false);
    }
  };

  if (user?.isFraud) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="alert alert-error max-w-md shadow-lg">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>You have been marked as fraud. Your account is restricted from adding new tickets.</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="bg-base-100 shadow-xl rounded-box p-6 border border-base-200">
        <h2 className="text-2xl font-bold mb-6">Add New Ticket</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Vendor Info (Readonly) */}
            <div className="form-control w-full">
              <label className="label"><span className="label-text">Vendor Name</span></label>
              <input type="text" value={user?.name || ''} readOnly className="input input-bordered w-full bg-base-200" />
            </div>
            <div className="form-control w-full">
              <label className="label"><span className="label-text">Vendor Email</span></label>
              <input type="email" value={user?.email || ''} readOnly className="input input-bordered w-full bg-base-200" />
            </div>

            {/* Ticket Info */}
            <div className="form-control w-full md:col-span-2">
              <label className="label"><span className="label-text">Ticket Title*</span></label>
              <input type="text" {...register("title", { required: true })} className="input input-bordered w-full" placeholder="e.g. Green Line Express - Dhaka to Chittagong" />
              {errors.title && <span className="text-error text-sm mt-1">Title is required</span>}
            </div>

            <div className="form-control w-full">
              <label className="label"><span className="label-text">From Location*</span></label>
              <input type="text" {...register("fromLocation", { required: true })} className="input input-bordered w-full" placeholder="Departure City" />
              {errors.fromLocation && <span className="text-error text-sm mt-1">From Location is required</span>}
            </div>
            
            <div className="form-control w-full">
              <label className="label"><span className="label-text">To Location*</span></label>
              <input type="text" {...register("toLocation", { required: true })} className="input input-bordered w-full" placeholder="Destination City" />
              {errors.toLocation && <span className="text-error text-sm mt-1">To Location is required</span>}
            </div>

            <div className="form-control w-full">
              <label className="label"><span className="label-text">Transport Type*</span></label>
              <select {...register("transportType", { required: true })} className="select select-bordered w-full">
                <option value="">Select Transport</option>
                <option value="bus">Bus</option>
                <option value="train">Train</option>
                <option value="launch">Launch</option>
                <option value="plane">Plane</option>
              </select>
              {errors.transportType && <span className="text-error text-sm mt-1">Transport Type is required</span>}
            </div>

            <div className="form-control w-full">
              <label className="label"><span className="label-text">Price per unit ($)*</span></label>
              <input type="number" step="0.01" min="1" {...register("price", { required: true, min: 1 })} className="input input-bordered w-full" placeholder="0.00" />
              {errors.price && <span className="text-error text-sm mt-1">Valid price is required</span>}
            </div>

            <div className="form-control w-full">
              <label className="label"><span className="label-text">Quantity*</span></label>
              <input type="number" min="1" {...register("quantity", { required: true, min: 1 })} className="input input-bordered w-full" placeholder="Available seats/tickets" />
              {errors.quantity && <span className="text-error text-sm mt-1">Valid quantity is required</span>}
            </div>

            <div className="form-control w-full">
              <label className="label"><span className="label-text">Departure Date*</span></label>
              <input type="date" {...register("departureDate", { required: true })} className="input input-bordered w-full" />
              {errors.departureDate && <span className="text-error text-sm mt-1">Departure Date is required</span>}
            </div>

            <div className="form-control w-full">
              <label className="label"><span className="label-text">Departure Time*</span></label>
              <input type="time" {...register("departureTime", { required: true })} className="input input-bordered w-full" />
              {errors.departureTime && <span className="text-error text-sm mt-1">Departure Time is required</span>}
            </div>

            <div className="form-control w-full md:col-span-2">
              <label className="label"><span className="label-text">Ticket Image*</span></label>
              <input type="file" accept="image/*" {...register("image", { required: true })} className="file-input file-input-bordered w-full" />
              {errors.image && <span className="text-error text-sm mt-1">Image is required</span>}
            </div>

            <div className="form-control w-full md:col-span-2">
              <label className="label"><span className="label-text">Perks (Optional)</span></label>
              <div className="flex flex-wrap gap-4">
                {['AC', 'WiFi', 'Breakfast', 'Lunch', 'Charging Port', 'Extra Legroom', 'Window Seat'].map(perk => (
                  <label key={perk} className="label cursor-pointer justify-start gap-2 border rounded-lg px-3 py-1 bg-base-200">
                    <input type="checkbox" value={perk} {...register("perks")} className="checkbox checkbox-sm checkbox-primary" />
                    <span className="label-text">{perk}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button type="submit" className="btn btn-primary w-full md:w-auto px-8" disabled={isUploading}>
              {isUploading ? <span className="loading loading-spinner"></span> : 'Add Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTicket;
