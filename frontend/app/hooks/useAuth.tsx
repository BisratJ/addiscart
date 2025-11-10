'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { authAPI, userAPI } from '../lib/api';
import { mockLogin, mockRegister, mockGetCurrentUser, shouldUseMockAuth } from '../lib/mockAuth';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Check if we should use mock authentication
const useMockAuth = shouldUseMockAuth();

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Sync NextAuth session with local auth state
  useEffect(() => {
    const checkAuth = async () => {
      // Check for cached user data first to avoid unnecessary API calls
      const cachedUserData = localStorage.getItem('userData');
      const storedToken = localStorage.getItem('token');
      
      if (storedToken && cachedUserData) {
        try {
          const userData = JSON.parse(cachedUserData);
          const cacheTime = userData.timestamp || 0;
          const now = Date.now();
          const cacheAge = now - cacheTime;
          
          // Use cached data if it's less than 7 days old
          if (cacheAge < 7 * 24 * 60 * 60 * 1000) {
            setToken(storedToken);
            setUser(userData.user);
            setIsLoading(false);
            return;
          }
        } catch (e) {
          console.error('Error parsing cached user data:', e);
          // Continue with normal auth flow if cache parsing fails
        }
      }
      
      if (storedToken) {
        setToken(storedToken);
        try {
          let userData;
          if (useMockAuth) {
            userData = await mockGetCurrentUser();
          } else {
            const response = await authAPI.getMe();
            userData = response.data;
          }
          
          // Cache the user data
          if (userData) {
            localStorage.setItem('userData', JSON.stringify({
              user: userData,
              timestamp: Date.now()
            }));
            setUser(userData);
          }
        } catch (error) {
          console.error('Authentication error:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('userData');
          setToken(null);
        }
      }
      
      setIsLoading(false);
    };

    if (status === 'loading') {
      setIsLoading(true);
      return;
    }

    if (session?.user) {
      // User logged in via Google OAuth
      const googleUser: User = {
        id: session.user.id || session.user.email || '',
        name: session.user.name || '',
        email: session.user.email || '',
        role: 'customer',
      };
      setUser(googleUser);
      setToken(session.accessToken || 'google-oauth-token');
      setIsLoading(false);
      return;
    }

    // Fall back to checking local storage for regular login
    checkAuth();
  }, [session, status]);

  // Login function - optimized with memoization
  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      if (useMockAuth) {
        const { token, user } = await mockLogin(email, password);
        localStorage.setItem('token', token);
        
        // Cache user data
        localStorage.setItem('userData', JSON.stringify({
          user,
          timestamp: Date.now()
        }));
        
        setToken(token);
        setUser(user);
      } else {
        const response = await authAPI.login({ email, password });
        const { token, user } = response.data;
        
        localStorage.setItem('token', token);
        
        // Cache user data
        localStorage.setItem('userData', JSON.stringify({
          user,
          timestamp: Date.now()
        }));
        
        setToken(token);
        setUser(user);
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Register function - optimized with memoization
  const register = useCallback(async (userData: any) => {
    setIsLoading(true);
    try {
      if (useMockAuth) {
        const { token, user } = await mockRegister(userData);
        localStorage.setItem('token', token);
        
        // Cache user data
        localStorage.setItem('userData', JSON.stringify({
          user,
          timestamp: Date.now()
        }));
        
        setToken(token);
        setUser(user);
      } else {
        const response = await authAPI.register(userData);
        const { token, user } = response.data;
        
        localStorage.setItem('token', token);
        
        // Cache user data
        localStorage.setItem('userData', JSON.stringify({
          user,
          timestamp: Date.now()
        }));
        
        setToken(token);
        setUser(user);
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update profile function - optimized with memoization
  const updateProfile = useCallback(async (userData: Partial<User>) => {
    setIsLoading(true);
    try {
      // Update user data
      const updatedUser = { ...user, ...userData } as User;
      
      // Update in state
      setUser(updatedUser);
      
      // Update in localStorage
      localStorage.setItem('userData', JSON.stringify({
        user: updatedUser,
        timestamp: Date.now()
      }));

      // If using real API, make the API call
      if (!useMockAuth && token && user?.id) {
        try {
          await userAPI.updateProfile(user.id, userData);
        } catch (apiError) {
          console.error('API update failed, but local update succeeded:', apiError);
        }
      }
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [user, token]);

  // Logout function - optimized with memoization
  const logout = useCallback(async () => {
    // Sign out from NextAuth if using Google OAuth
    if (session) {
      await signOut({ redirect: false });
    }
    
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    localStorage.removeItem('cart'); // Clear cart on logout
    setToken(null);
    setUser(null);
    
    // Redirect to home page after logout
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  }, [session]);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    user,
    token,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile,
  }), [user, token, isLoading, login, register, logout, updateProfile]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
