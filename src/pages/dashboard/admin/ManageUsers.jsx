import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosSecure from '../../../lib/axios';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import LoadingSpinner from '../../../components/common/LoadingSpinner';

const ManageUsers = () => {
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const res = await axiosSecure.get('/api/admin/users');
      return res.data;
    }
  });

  const roleMutation = useMutation({
    mutationFn: async ({ id, role }) => {
      const res = await axiosSecure.patch(`/api/admin/users/${id}/role`, { role });
      return res.data;
    },
    onSuccess: () => {
      toast.success('User role updated successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to update user role');
    }
  });

  const fraudMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.patch(`/api/admin/users/${id}/fraud`);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Vendor marked as fraud');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to mark as fraud');
    }
  });

  const handleUpdateRole = (id, role) => {
    Swal.fire({
      title: `Make this user a ${role}?`,
      text: "You can change this later.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, update it!'
    }).then((result) => {
      if (result.isConfirmed) {
        roleMutation.mutate({ id, role });
      }
    });
  };

  const handleMarkFraud = (id) => {
    Swal.fire({
      title: 'Mark as Fraud?',
      text: "This will hide all of this vendor's tickets and prevent them from adding new ones.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, mark as fraud!'
    }).then((result) => {
      if (result.isConfirmed) {
        fraudMutation.mutate(id);
      }
    });
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Manage Users</h2>
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user._id}>
                <th>{index + 1}</th>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <div className={`badge ${
                    user.role === 'admin' ? 'badge-primary' :
                    user.role === 'vendor' ? 'badge-secondary' : 'badge-info'
                  }`}>
                    {user.role || 'user'}
                  </div>
                  {user.isFraud && (
                    <div className="badge badge-error ml-2 font-bold">FRAUD</div>
                  )}
                </td>
                <td>
                  <div className="flex gap-2">
                    {user.role !== 'admin' && (
                      <button 
                        onClick={() => handleUpdateRole(user._id, 'admin')}
                        className="btn btn-primary btn-outline btn-sm"
                        disabled={roleMutation.isPending}
                      >
                        Make Admin
                      </button>
                    )}
                    {user.role !== 'vendor' && (
                      <button 
                        onClick={() => handleUpdateRole(user._id, 'vendor')}
                        className="btn btn-secondary btn-outline btn-sm"
                        disabled={roleMutation.isPending}
                      >
                        Make Vendor
                      </button>
                    )}
                    {user.role === 'vendor' && !user.isFraud && (
                      <button 
                        onClick={() => handleMarkFraud(user._id)}
                        className="btn btn-error btn-sm"
                        disabled={fraudMutation.isPending}
                      >
                        Mark as Fraud
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <div className="text-center py-10 text-gray-500">No users found.</div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;
