import React from 'react';
import { useAuth } from '../../../providers/AuthProvider';
import { format } from 'date-fns';

const AdminProfile = () => {
  const { user } = useAuth();

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <div className="card w-96 bg-base-200 shadow-xl">
        <div className="card-body items-center text-center">
          <div className="avatar mb-4">
            <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <img src={user?.photoURL || 'https://via.placeholder.com/150'} alt="Admin Avatar" />
            </div>
          </div>
          <h2 className="card-title text-2xl font-bold">{user?.displayName || 'Admin Name'}</h2>
          <p className="text-gray-500">{user?.email}</p>
          <div className="badge badge-primary uppercase mt-2">Admin</div>
          <div className="mt-4 text-sm text-gray-500">
            <p>Account Created:</p>
            <p className="font-semibold">
              {user?.metadata?.creationTime 
                ? format(new Date(user?.metadata?.creationTime), 'PPpp') 
                : 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
