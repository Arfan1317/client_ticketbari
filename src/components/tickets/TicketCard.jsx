import React from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';
import { format } from 'date-fns';

const TicketCard = ({ ticket }) => {
  const { _id, title, image, from, to, price, quantity, perks, departureDate, departureTime, transportType } = ticket;

  const getBadgeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'bus': return 'badge-primary';
      case 'train': return 'badge-secondary';
      case 'launch': return 'badge-accent';
      case 'plane': return 'badge-info';
      default: return 'badge-ghost';
    }
  };

  return (
    <div className="card w-full bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col">
      <figure className="relative">
        <img src={image} alt={title} className="h-48 w-full object-cover rounded-t-2xl" />
        <div className={`badge ${getBadgeColor(transportType)} absolute top-4 right-4 border-none text-white font-semibold py-3 px-4`}>
          {transportType?.charAt(0).toUpperCase() + transportType?.slice(1)}
        </div>
      </figure>
      <div className="card-body flex-grow p-6">
        <h2 className="card-title text-xl font-bold line-clamp-1 mb-2" title={title}>{title}</h2>
        
        <div className="flex items-center text-gray-600 mb-2 gap-2">
          <FaMapMarkerAlt className="text-primary" />
          <span className="font-medium">{from}</span>
          <span className="mx-1 text-gray-400">→</span>
          <span className="font-medium">{to}</span>
        </div>

        <div className="flex items-center text-gray-600 mb-4 gap-2">
          <FaCalendarAlt className="text-primary" />
          <span>{departureDate ? format(new Date(departureDate), 'MMM dd, yyyy') : 'TBA'} at {departureTime}</span>
        </div>

        {perks && perks.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {perks.slice(0, 3).map((perk, index) => (
              <span key={index} className="badge badge-outline badge-sm">{perk}</span>
            ))}
            {perks.length > 3 && <span className="badge badge-outline badge-sm">+{perks.length - 3}</span>}
          </div>
        )}

        <div className="mt-auto">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm text-gray-500">Available: <span className="font-semibold text-gray-700">{quantity}</span></p>
            </div>
            <div className="text-2xl font-bold text-primary">
              ${price}
            </div>
          </div>
          
          <div className="card-actions w-full">
            <Link to={`/tickets/${_id}`} className="btn btn-primary btn-sm w-full">
              See Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketCard;
