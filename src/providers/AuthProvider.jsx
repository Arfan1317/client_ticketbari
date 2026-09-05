import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { authClient } from '../lib/auth-client';
import axiosSecure from '../lib/axios';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const { data: session, isPending: sessionLoading, error: sessionError } = authClient.useSession();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sync user with our backend when BetterAuth session changes
  const syncUser = useCallback(async (sessionData) => {
    if (!sessionData?.user) return null;
    
    try {
      // Sync user to our database
      const syncRes = await axiosSecure.post('/api/users/sync', {
        authId: sessionData.user.id,
        name: sessionData.user.name,
        email: sessionData.user.email,
        image: sessionData.user.image || '',
      });
      
      // Get JWT token
      const tokenRes = await axiosSecure.post('/api/jwt', {
        email: sessionData.user.email,
      });
      
      if (tokenRes.data.token) {
        localStorage.setItem('access-token', tokenRes.data.token);
      }
      
      return syncRes.data.user;
    } catch (error) {
      console.error('Error syncing user:', error);
      return null;
    }
  }, []);

  useEffect(() => {
    const handleSession = async () => {
      if (sessionLoading) return; // Still loading, wait
      
      if (session?.user) {
        const syncedUser = await syncUser(session);
        setUser(syncedUser);
      } else {
        setUser(null);
        localStorage.removeItem('access-token');
      }
      setLoading(false);
    };

    handleSession();
  }, [session, sessionLoading, syncUser]);

  const register = async (name, email, password) => {
    const result = await authClient.signUp.email({
      name,
      email,
      password,
    });
    
    // BetterAuth returns { data, error } — check for error
    if (result.error) {
      throw new Error(result.error.message || 'Registration failed');
    }
    
    // After successful signup, BetterAuth auto-creates a session
    // The useSession hook will detect it and trigger syncUser via useEffect
    // But we also sync immediately for instant UI update
    if (result.data?.user) {
      const syncedUser = await syncUser({ user: result.data.user });
      if (syncedUser) setUser(syncedUser);
    }
    
    return result;
  };

  const login = async (email, password) => {
    const result = await authClient.signIn.email({
      email,
      password,
    });
    
    if (result.error) {
      throw new Error(result.error.message || 'Login failed');
    }
    
    // Immediately sync for instant UI update
    if (result.data?.user) {
      const syncedUser = await syncUser({ user: result.data.user });
      if (syncedUser) setUser(syncedUser);
    }
    
    return result;
  };

  const loginWithGoogle = async () => {
    const result = await authClient.signIn.social({
      provider: 'google',
      callbackURL: '/',
    });
    
    if (result.error) {
      throw new Error(result.error.message || 'Google login failed');
    }
    
    // Google OAuth redirects, so session will be picked up on return
    return result;
  };

  const logout = async () => {
    try {
      await authClient.signOut();
    } catch (e) {
      console.error('Logout error:', e);
    }
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
