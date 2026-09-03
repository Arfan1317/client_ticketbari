import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosSecure from '../lib/axios';
import TicketCard from '../components/tickets/TicketCard';
import { FaSearch } from 'react-icons/fa';

const AllTickets = () => {
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [transportType, setTransportType] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [page, setPage] = useState(1);
  const limit = 9;

  const { data, isLoading } = useQuery({
    queryKey: ['allTickets', search, transportType, sortBy, page],
    queryFn: async () => {
      const res = await axiosSecure.get(`/api/tickets`, {
        params: { search, transportType, sort: sortBy, page, limit }
      });
      return res.data;
    }
  });

  const tickets = data?.tickets || [];
  const totalPages = data?.totalPages || 1;

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handleTransportChange = (e) => {
    setTransportType(e.target.value);
    setPage(1);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setPage(1);
  };

  return (
    <div className="min-h-screen py-10 max-w-7xl mx-auto px-4">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">All Tickets</h1>

      {/* Filter Bar */}
      <div className="bg-base-200 p-4 rounded-xl mb-8 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <form onSubmit={handleSearch} className="join w-full md:w-1/3">
          <input 
            type="text" 
            placeholder="Search by location..." 
            className="input input-bordered join-item w-full" 
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button type="submit" className="btn btn-primary join-item">
            <FaSearch />
          </button>
        </form>

        <div className="flex w-full md:w-auto gap-4">
          <select 
            className="select select-bordered w-full md:w-auto" 
            value={transportType}
            onChange={handleTransportChange}
          >
            <option value="">All Transports</option>
            <option value="bus">Bus</option>
            <option value="train">Train</option>
            <option value="launch">Launch</option>
            <option value="plane">Plane</option>
          </select>

          <select 
            className="select select-bordered w-full md:w-auto"
            value={sortBy}
            onChange={handleSortChange}
          >
            <option value="">Default Sorting</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Ticket Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : tickets.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {tickets.map(ticket => (
              <TicketCard key={ticket._id} ticket={ticket} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center">
              <div className="join">
                <button 
                  className="join-item btn" 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  «
                </button>
                <button className="join-item btn">Page {page} of {totalPages}</button>
                <button 
                  className="join-item btn" 
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  »
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16 bg-base-100 rounded-xl shadow-sm">
          <h3 className="text-2xl font-bold text-gray-600 mb-2">No tickets found</h3>
          <p className="text-gray-500">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
};

export default AllTickets;
