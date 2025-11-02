// src/context/AuthContext.jsx
import { createContext, useState, useContext, useEffect } from 'react';
import { authAPI, walletAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load user from localStorage and verify token on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('access_token');
      const savedUser = localStorage.getItem('user');
      
      if (token && savedUser) {
        try {
          // Verify token is still valid
          const response = await authAPI.getMe();
          setUser(response.user);
          setIsAuthenticated(true);
          
          // Fetch wallet data
          const walletResponse = await walletAPI.getWallet();
          setWallet(walletResponse.wallet);
        } catch (error) {
          console.error('Token verification failed:', error);
          // Clear invalid token
          localStorage.removeItem('access_token');
          localStorage.removeItem('user');
          localStorage.removeItem('wallet');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      const { access_token, user: userData, wallet: walletData } = response;
      
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('user', JSON.stringify(userData));
      if (walletData) {
        localStorage.setItem('wallet', JSON.stringify(walletData));
        setWallet(walletData);
      }
      
      setUser(userData);
      setIsAuthenticated(true);
      
      return { success: true, user: userData };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.error || 'Login failed. Please check your credentials.',
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      const { access_token, user: newUser, wallet: newWallet } = response;
      
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('user', JSON.stringify(newUser));
      if (newWallet) {
        localStorage.setItem('wallet', JSON.stringify(newWallet));
        setWallet(newWallet);
      }
      
      setUser(newUser);
      setIsAuthenticated(true);
      
      return { success: true, user: newUser };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: error.error || 'Registration failed. Please try again.',
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    localStorage.removeItem('wallet');
    setUser(null);
    setWallet(null);
    setIsAuthenticated(false);
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const updateWallet = (walletData) => {
    setWallet(walletData);
    localStorage.setItem('wallet', JSON.stringify(walletData));
  };

  const refreshWallet = async () => {
    try {
      const response = await walletAPI.getWallet();
      const walletData = response.wallet;
      setWallet(walletData);
      localStorage.setItem('wallet', JSON.stringify(walletData));
      return walletData;
    } catch (error) {
      console.error('Failed to refresh wallet:', error);
      throw error;
    }
  };

  const value = {
    user,
    wallet,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
    updateWallet,
    refreshWallet,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};