import React from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { useQuery } from '@tanstack/react-query';
import { FaTag, FaShieldAlt, FaHeadset, FaCheckCircle, FaBus, FaTrain, FaShip, FaPlane } from 'react-icons/fa';
import TicketCard from '../components/tickets/TicketCard';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import axiosSecure from '../lib/axios';

const SectionTitle = ({ title, subtitle }) => (
  <div className="text-center mb-12">
    <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
    <p className="text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
  </div>
);

const Home = () => {
  const { data: advertisedTickets = [], isLoading: isLoadingAds } = useQuery({
    queryKey: ['advertisedTickets'],
    queryFn: async () => {
      const res = await axiosSecure.get('/api/tickets/advertised');
      return res.data;
    }
  });

  const { data: latestTickets = [], isLoading: isLoadingLatest } = useQuery({
    queryKey: ['latestTickets'],
    queryFn: async () => {
      const res = await axiosSecure.get('/api/tickets/latest');
      return res.data;
    }
  });

  const popularRoutes = [
    { from: 'Dhaka', to: 'Chattogram', type: 'Bus', icon: <FaBus className="text-3xl" /> },
    { from: 'Dhaka', to: 'Sylhet', type: 'Train', icon: <FaTrain className="text-3xl" /> },
    { from: 'Dhaka', to: 'Barishal', type: 'Launch', icon: <FaShip className="text-3xl" /> },
    { from: 'Dhaka', to: "Cox's Bazar", type: 'Plane', icon: <FaPlane className="text-3xl" /> },
    { from: 'Dhaka', to: 'Rajshahi', type: 'Bus', icon: <FaBus className="text-3xl" /> },
    { from: 'Dhaka', to: 'Khulna', type: 'Train', icon: <FaTrain className="text-3xl" /> }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <section className="w-full">
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          slidesPerView={1}
          pagination={{ clickable: true }}
          navigation
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop={true}
          speed={800}
          className="w-full h-[60vh] sm:h-[70vh] min-h-[400px]"
        >
          {/* Slide 1 - Bus */}
          <SwiperSlide>
            <div
              className="w-full h-full bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url('https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=1920&q=80&fit=crop')`, backgroundColor: '#1a3a3a' }}
            >
              <div className="w-full h-full flex items-center justify-center text-center px-4">
                <div className="text-white max-w-3xl">
                  <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold mb-6 drop-shadow-lg leading-tight">
                    Travel by Bus,<br/>Comfort Guaranteed
                  </h1>
                  <p className="text-lg md:text-xl mb-8 opacity-90 max-w-2xl mx-auto drop-shadow">
                    Experience the most comfortable road journeys across the country.
                  </p>
                  <Link to="/all-tickets" className="btn btn-primary btn-lg border-none text-white shadow-lg hover:scale-105 transition-transform">
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>

          {/* Slide 2 - Train */}
          <SwiperSlide>
            <div
              className="w-full h-full bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url('https://images.unsplash.com/photo-1532105956626-9569c03602f6?w=1920&q=80&fit=crop')`, backgroundColor: '#1a2a4a' }}
            >
              <div className="w-full h-full flex items-center justify-center text-center px-4">
                <div className="text-white max-w-3xl">
                  <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold mb-6 drop-shadow-lg leading-tight">
                    Explore the Country<br/>by Train
                  </h1>
                  <p className="text-lg md:text-xl mb-8 opacity-90 max-w-2xl mx-auto drop-shadow">
                    Enjoy scenic routes and timely departures with our premium train services.
                  </p>
                  <Link to="/all-tickets" className="btn btn-primary btn-lg border-none text-white shadow-lg hover:scale-105 transition-transform">
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>

          {/* Slide 3 - Airplane */}
          <SwiperSlide>
            <div
              className="w-full h-full bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=1920&q=80&fit=crop')`, backgroundColor: '#1a2a3a' }}
            >
              <div className="w-full h-full flex items-center justify-center text-center px-4">
                <div className="text-white max-w-3xl">
                  <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold mb-6 drop-shadow-lg leading-tight">
                    Fly High,<br/>Pay Less
                  </h1>
                  <p className="text-lg md:text-xl mb-8 opacity-90 max-w-2xl mx-auto drop-shadow">
                    Discover the fastest way to travel at the best prices.
                  </p>
                  <Link to="/all-tickets" className="btn btn-primary btn-lg border-none text-white shadow-lg hover:scale-105 transition-transform">
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>

          {/* Slide 4 - Launch/Ship */}
          <SwiperSlide>
            <div
              className="w-full h-full bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url('https://images.unsplash.com/photo-1468413253725-0d5181091126?w=1920&q=80&fit=crop')`, backgroundColor: '#0a2a3a' }}
            >
              <div className="w-full h-full flex items-center justify-center text-center px-4">
                <div className="text-white max-w-3xl">
                  <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold mb-6 drop-shadow-lg leading-tight">
                    Sail the Waters,<br/>Discover New Places
                  </h1>
                  <p className="text-lg md:text-xl mb-8 opacity-90 max-w-2xl mx-auto drop-shadow">
                    Enjoy a relaxing journey by launch across beautiful waterways.
                  </p>
                  <Link to="/all-tickets" className="btn btn-primary btn-lg border-none text-white shadow-lg hover:scale-105 transition-transform">
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </section>

      {/* Advertisement Section */}
      <section className="py-16 max-w-7xl mx-auto px-4">
        <SectionTitle title="Featured Tickets" subtitle="Handpicked deals by our team" />
        {isLoadingAds ? (
          <div className="flex justify-center"><span className="loading loading-spinner loading-lg text-primary"></span></div>
        ) : advertisedTickets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {advertisedTickets.map(ticket => (
              <TicketCard key={ticket._id} ticket={ticket} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 text-lg">No featured tickets available at the moment.</p>
        )}
      </section>

      {/* Popular Routes Section */}
      <section className="py-16 bg-base-200">
        <div className="max-w-7xl mx-auto px-4">
          <SectionTitle title="Popular Routes" subtitle="Most searched destinations" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularRoutes.map((route, idx) => (
              <Link to="/all-tickets" key={idx} className="card bg-base-100 shadow hover:shadow-md transition-shadow cursor-pointer">
                <div className="card-body flex-row items-center gap-4">
                  <div className="p-4 bg-primary/10 rounded-full text-primary">
                    {route.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{route.from} <span className="text-gray-400 font-normal mx-1">→</span> {route.to}</h3>
                    <p className="text-sm text-gray-500">via {route.type}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Tickets Section */}
      <section className="py-16 max-w-7xl mx-auto px-4">
        <SectionTitle title="Latest Tickets" subtitle="Recently added travel options" />
        {isLoadingLatest ? (
          <div className="flex justify-center"><span className="loading loading-spinner loading-lg text-primary"></span></div>
        ) : latestTickets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {latestTickets.map(ticket => (
              <TicketCard key={ticket._id} ticket={ticket} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 text-lg">No tickets found.</p>
        )}
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-primary text-primary-content">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose TicketBari?</h2>
            <p className="opacity-90 max-w-2xl mx-auto">We make travel booking simple and reliable</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 flex flex-col items-center">
              <FaTag className="text-5xl mb-4" />
              <h3 className="text-xl font-bold mb-2">Best Prices</h3>
              <p className="opacity-80">Get the best deals on travel tickets</p>
            </div>
            <div className="text-center p-6 flex flex-col items-center">
              <FaShieldAlt className="text-5xl mb-4" />
              <h3 className="text-xl font-bold mb-2">Secure Payment</h3>
              <p className="opacity-80">Your payments are safe with Stripe</p>
            </div>
            <div className="text-center p-6 flex flex-col items-center">
              <FaHeadset className="text-5xl mb-4" />
              <h3 className="text-xl font-bold mb-2">24/7 Support</h3>
              <p className="opacity-80">We're here to help anytime</p>
            </div>
            <div className="text-center p-6 flex flex-col items-center">
              <FaCheckCircle className="text-5xl mb-4" />
              <h3 className="text-xl font-bold mb-2">Easy Booking</h3>
              <p className="opacity-80">Book tickets in just a few clicks</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
