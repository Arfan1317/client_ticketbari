import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import DashboardLayout from './components/layout/DashboardLayout';
import PrivateRoute from './routes/PrivateRoute';
import RoleRoute from './routes/RoleRoute';
import ErrorPage from './pages/ErrorPage';
import Home from './pages/Home';
import AllTickets from './pages/AllTickets';
import TicketDetails from './pages/TicketDetails';
import Login from './pages/Login';
import Register from './pages/Register';

// Dashboard placeholders
import UserProfile from './pages/dashboard/user/UserProfile';
import MyBookedTickets from './pages/dashboard/user/MyBookedTickets';
import TransactionHistory from './pages/dashboard/user/TransactionHistory';
import VendorProfile from './pages/dashboard/vendor/VendorProfile';
import AddTicket from './pages/dashboard/vendor/AddTicket';
import MyAddedTickets from './pages/dashboard/vendor/MyAddedTickets';
import RequestedBookings from './pages/dashboard/vendor/RequestedBookings';
import RevenueOverview from './pages/dashboard/vendor/RevenueOverview';
import AdminProfile from './pages/dashboard/admin/AdminProfile';
import ManageTickets from './pages/dashboard/admin/ManageTickets';
import ManageUsers from './pages/dashboard/admin/ManageUsers';
import AdvertiseTickets from './pages/dashboard/admin/AdvertiseTickets';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: 'all-tickets', element: <AllTickets /> },
      { path: 'tickets/:id', element: <PrivateRoute><TicketDetails /></PrivateRoute> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
    ],
  },
  {
    path: '/dashboard',
    element: <PrivateRoute><DashboardLayout /></PrivateRoute>,
    errorElement: <ErrorPage />,
    children: [
      // User routes
      { path: 'user-profile', element: <RoleRoute allowedRoles={['user']}><UserProfile /></RoleRoute> },
      { path: 'my-booked-tickets', element: <RoleRoute allowedRoles={['user']}><MyBookedTickets /></RoleRoute> },
      { path: 'transaction-history', element: <RoleRoute allowedRoles={['user']}><TransactionHistory /></RoleRoute> },
      // Vendor routes  
      { path: 'vendor-profile', element: <RoleRoute allowedRoles={['vendor']}><VendorProfile /></RoleRoute> },
      { path: 'add-ticket', element: <RoleRoute allowedRoles={['vendor']}><AddTicket /></RoleRoute> },
      { path: 'my-added-tickets', element: <RoleRoute allowedRoles={['vendor']}><MyAddedTickets /></RoleRoute> },
      { path: 'requested-bookings', element: <RoleRoute allowedRoles={['vendor']}><RequestedBookings /></RoleRoute> },
      { path: 'revenue-overview', element: <RoleRoute allowedRoles={['vendor']}><RevenueOverview /></RoleRoute> },
      // Admin routes
      { path: 'admin-profile', element: <RoleRoute allowedRoles={['admin']}><AdminProfile /></RoleRoute> },
      { path: 'manage-tickets', element: <RoleRoute allowedRoles={['admin']}><ManageTickets /></RoleRoute> },
      { path: 'manage-users', element: <RoleRoute allowedRoles={['admin']}><ManageUsers /></RoleRoute> },
      { path: 'advertise-tickets', element: <RoleRoute allowedRoles={['admin']}><AdvertiseTickets /></RoleRoute> },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
