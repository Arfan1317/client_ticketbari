import { Outlet, NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider';
import { FaBars, FaHome, FaUser, FaTicketAlt, FaHistory, FaPlus, FaList, FaMoneyBillWave, FaUsers, FaAd } from 'react-icons/fa';

const DashboardLayout = () => {
  const { user } = useAuth();

  const getLinks = () => {
    if (user?.role === 'admin') {
      return (
        <>
          <li><NavLink to="/dashboard/admin-profile"><FaUser /> Admin Profile</NavLink></li>
          <li><NavLink to="/dashboard/manage-tickets"><FaTicketAlt /> Manage Tickets</NavLink></li>
          <li><NavLink to="/dashboard/manage-users"><FaUsers /> Manage Users</NavLink></li>
          <li><NavLink to="/dashboard/advertise-tickets"><FaAd /> Advertise Tickets</NavLink></li>
        </>
      );
    } else if (user?.role === 'vendor') {
      return (
        <>
          <li><NavLink to="/dashboard/vendor-profile"><FaUser /> Vendor Profile</NavLink></li>
          <li><NavLink to="/dashboard/add-ticket"><FaPlus /> Add Ticket</NavLink></li>
          <li><NavLink to="/dashboard/my-added-tickets"><FaList /> My Added Tickets</NavLink></li>
          <li><NavLink to="/dashboard/requested-bookings"><FaTicketAlt /> Requested Bookings</NavLink></li>
          <li><NavLink to="/dashboard/revenue-overview"><FaMoneyBillWave /> Revenue Overview</NavLink></li>
        </>
      );
    } else {
      return (
        <>
          <li><NavLink to="/dashboard/user-profile"><FaUser /> User Profile</NavLink></li>
          <li><NavLink to="/dashboard/my-booked-tickets"><FaTicketAlt /> My Booked Tickets</NavLink></li>
          <li><NavLink to="/dashboard/transaction-history"><FaHistory /> Transaction History</NavLink></li>
        </>
      );
    }
  };

  return (
    <div className="drawer lg:drawer-open">
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col bg-base-100">
        {/* Navbar for mobile only */}
        <div className="w-full navbar bg-base-200 lg:hidden">
          <div className="flex-none">
            <label htmlFor="dashboard-drawer" className="btn btn-square btn-ghost">
              <FaBars className="text-xl" />
            </label>
          </div>
          <div className="flex-1 px-2 mx-2 font-bold text-xl text-primary">TicketBari Dashboard</div>
        </div>
        
        {/* Page content */}
        <div className="p-6">
          <Outlet />
        </div>
      </div> 
      <div className="drawer-side">
        <label htmlFor="dashboard-drawer" className="drawer-overlay"></label> 
        <div className="menu p-4 w-64 h-full bg-base-200 text-base-content flex flex-col">
          <div className="mb-8 flex flex-col items-center">
            <div className="avatar mb-4">
              <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img src={user?.image || 'https://ui-avatars.com/api/?name=' + user?.name} alt={user?.name} />
              </div>
            </div>
            <h2 className="text-xl font-bold">{user?.name}</h2>
            <div className="badge badge-primary badge-outline mt-2 uppercase">{user?.role}</div>
          </div>
          
          <ul className="flex-1 space-y-2">
            {getLinks()}
          </ul>
          
          <div className="divider"></div>
          <ul className="space-y-2">
            <li><Link to="/"><FaHome /> Back to Home</Link></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
