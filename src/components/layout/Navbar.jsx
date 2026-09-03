import { Link, NavLink } from 'react-router-dom';
import { FaBus, FaMoon, FaSun } from 'react-icons/fa';
import { useAuth } from '../../providers/AuthProvider';
import { useTheme } from '../../providers/ThemeProvider';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const getDashboardLink = () => {
    if (!user) return '/';
    if (user.role === 'admin') return '/dashboard/admin-profile';
    if (user.role === 'vendor') return '/dashboard/vendor-profile';
    return '/dashboard/user-profile';
  };

  const navLinks = (
    <>
      <li><NavLink to="/">Home</NavLink></li>
      <li><NavLink to="/all-tickets">All Tickets</NavLink></li>
      {user && <li><NavLink to={getDashboardLink()}>Dashboard</NavLink></li>}
    </>
  );

  return (
    <div className="navbar bg-base-100 shadow-sm sticky top-0 z-50 px-4">
      {/* Navbar Start - Hamburger + Logo */}
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </label>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            {navLinks}
            {/* Show Login/Register in mobile dropdown when not logged in */}
            {!user && (
              <>
                <div className="divider my-1"></div>
                <li><NavLink to="/login">Login</NavLink></li>
                <li><NavLink to="/register">Register</NavLink></li>
              </>
            )}
          </ul>
        </div>
        <Link to="/" className="btn btn-ghost normal-case text-xl gap-2 px-2">
          <FaBus className="text-primary" />
          <span className="font-bold text-primary">TicketBari</span>
        </Link>
      </div>

      {/* Navbar Center - Desktop nav links */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          {navLinks}
        </ul>
      </div>

      {/* Navbar End - Theme toggle + Auth */}
      <div className="navbar-end gap-1">
        <button onClick={toggleTheme} className="btn btn-ghost btn-circle btn-sm">
          {theme === 'light' ? <FaMoon className="text-lg" /> : <FaSun className="text-lg" />}
        </button>

        {user ? (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img src={user.image || 'https://ui-avatars.com/api/?name=' + user.name} alt={user.name} />
              </div>
            </label>
            <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
              <li className="px-4 py-2 border-b border-base-200">
                <span className="font-bold block">{user.name}</span>
                <span className="text-xs opacity-70 block">{user.role}</span>
              </li>
              <li><Link to={getDashboardLink()}>My Profile</Link></li>
              <li><button onClick={logout}>Logout</button></li>
            </ul>
          </div>
        ) : (
          <>
            {/* Desktop only - Login/Register buttons */}
            <div className="hidden sm:flex gap-2">
              <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
