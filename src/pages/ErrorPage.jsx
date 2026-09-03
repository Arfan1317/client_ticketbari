import { Link } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';

const ErrorPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-100">
      <FaExclamationTriangle className="text-6xl text-warning mb-6" />
      <h1 className="text-6xl font-bold text-base-content mb-4">404</h1>
      <p className="text-xl text-base-content/60 mb-8">Page not found</p>
      <Link to="/" className="btn btn-primary">
        Go Back Home
      </Link>
    </div>
  );
};
export default ErrorPage;
