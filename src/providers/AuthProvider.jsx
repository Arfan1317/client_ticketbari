import { createContext, useContext, useEffect, useState } from 'react';
import { authClient } from '../lib/auth-client';
import axiosSecure from '../lib/axios';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const syncUser = async () => {
      if (session?.user) {
        try {
         
          const syncRes = await axiosSecure.post('/api/users/sync', {
            authId: session.user.id,
            name: session.user.name,
            email: session.user.email,
            image: session.user.image || '',
          });
          
         
          const tokenRes = await axiosSecure.post('/api/jwt', {
            email: session.user.email,
          });
          
          if (tokenRes.data.token) {
            localStorage.setItem('access-token', tokenRes.data.token);
          }
          
          setUser(syncRes.data.user);
        } catch (error) {
          console.error('Error syncing user:', error);
        }
      } else if (!sessionLoading) {
        setUser(null);
        localStorage.removeItem('access-token');
      }
      setLoading(false);
    };

    if (!sessionLoading) {
      syncUser();
    }
  }, [session, sessionLoading]);

  const register = async (name, email, password) => {
    const result = await authClient.signUp.email({
      name,
      email,
      password,
    });
    return result;
  };

  const login = async (email, password) => {
    const result = await authClient.signIn.email({
      email,
      password,
    });
    return result;
  };

  const loginWithGoogle = async () => {
    const result = await authClient.signIn.social({
      provider: 'google',
      callbackURL: '/',
    });
    return result;
  };

  const logout = async () => {
    await authClient.signOut();
    setUser(null);
    localStorage.removeItem('access-token');
  };

  const value = {
    user,
    loading: loading || sessionLoading,
    session,
    register,
    login,
    loginWithGoogle,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
