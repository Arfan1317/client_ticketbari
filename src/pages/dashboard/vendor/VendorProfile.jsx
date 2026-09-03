import React from 'react';
import { useAuth } from '../../../providers/AuthProvider';

const VendorProfile = () => {
  const { user } = useAuth();

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)] p-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl p-8 border border-base-200">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="avatar">
            <div className={`w-32 rounded-full ring ${user?.isFraud ? 'ring-error' : 'ring-primary'} ring-offset-base-100 ring-offset-2`}>
              <img src={user?.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || 'Vendor'}`} alt="Vendor Avatar" />
            </div>
          </div>
          
          <div className="space-y-1">
            <h2 className="text-2xl font-bold">{user?.name}</h2>
            <p className="text-base-content/70">{user?.email}</p>
          </div>
          
          <div className="flex gap-2">
            <div className="badge badge-primary">{user?.role || 'Vendor'}</div>
            {user?.isFraud && (
              <div className="badge badge-error font-semibold">Marked as Fraud</div>
            )}
          </div>
          
          <div className="w-full mt-6 space-y-2 border-t border-base-300 pt-4 text-left text-sm">
            <div className="flex justify-between">
              <span className="font-semibold text-base-content/70">Vendor Account Created:</span>
              <span className="font-medium">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</span>
            </div>
            {/* Additional vendor info could go here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorProfile;
