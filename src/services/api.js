// src/services/api.js - FIXED VERSION
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Custom error class
class APIError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

// Handle API responses with better error handling
const handleResponse = async (response) => {
  const contentType = response.headers.get('content-type');
  
  if (contentType && contentType.includes('application/json')) {
    const data = await response.json();
    
    if (!response.ok) {
      // Handle 401 Unauthorized
      if (response.status === 401) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        localStorage.removeItem('wallet');
        window.location.href = '/';
      }
      
      // Throw custom error with details
      throw new APIError(
        data.error || 'Request failed',
        response.status,
        data
      );
    }
    
    return data;
  } else {
    if (!response.ok) {
      throw new APIError('Network response was not ok', response.status);
    }
    return response;
  }
};

// Retry logic for failed requests
const fetchWithRetry = async (url, options, retries = 2) => {
  try {
    const response = await fetch(url, options);
    return await handleResponse(response);
  } catch (error) {
    if (retries > 0 && error.status >= 500) {
      console.log(`Retrying... ${retries} attempts left`);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s
      return fetchWithRetry(url, options, retries - 1);
    }
    throw error;
  }
};

// Authentication API
export const authAPI = {
  register: async (userData) => {
    try {
      return await fetchWithRetry(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  },

  login: async (credentials) => {
    try {
      return await fetchWithRetry(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  getMe: async () => {
    try {
      return await fetchWithRetry(`${API_BASE_URL}/auth/me`, {
        headers: getAuthHeaders()
      });
    } catch (error) {
      console.error('Get me error:', error);
      throw error;
    }
  }
};

// User API
export const userAPI = {
  getProfile: async () => {
    try {
      return await fetchWithRetry(`${API_BASE_URL}/users/profile`, {
        headers: getAuthHeaders()
      });
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  },

  updateProfile: async (data) => {
    try {
      return await fetchWithRetry(`${API_BASE_URL}/users/profile`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      });
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },

  changePassword: async (data) => {
    try {
      return await fetchWithRetry(`${API_BASE_URL}/users/change-password`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      });
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  },

  getAllUsers: async () => {
    try {
      return await fetchWithRetry(`${API_BASE_URL}/users`, {
        headers: getAuthHeaders()
      });
    } catch (error) {
      console.error('Get all users error:', error);
      throw error;
    }
  }
};

// Wallet API - Updated for Pesapay
export const walletAPI = {
  getWallet: async () => {
    try {
      return await fetchWithRetry(`${API_BASE_URL}/wallet`, {
        headers: getAuthHeaders()
      });
    } catch (error) {
      console.error('Get wallet error:', error);
      throw error;
    }
  },

  // Pesapay deposit
  deposit: async (amount, phone, currency = 'USD') => {
    try {
      return await fetchWithRetry(`${API_BASE_URL}/wallet/deposit`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ amount, phone, currency })
      });
    } catch (error) {
      console.error('Deposit error:', error);
      throw error;
    }
  },

  // Check Pesapay payment status
  checkPaymentStatus: async (reference) => {
    try {
      return await fetchWithRetry(
        `${API_BASE_URL}/wallet/payment-status/${reference}`,
        { headers: getAuthHeaders() }
      );
    } catch (error) {
      console.error('Check payment status error:', error);
      throw error;
    }
  },

  addFunds: async (amount, note = '', method = 'card') => {
    try {
      return await fetchWithRetry(`${API_BASE_URL}/wallet/add-funds`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ amount, note, method })
      });
    } catch (error) {
      console.error('Add funds error:', error);
      throw error;
    }
  },

  // Keep this for backward compatibility (redirects to new endpoint)
  checkTransactionStatus: async (reference) => {
    return walletAPI.checkPaymentStatus(reference);
  }
};

// Transaction API
export const transactionAPI = {
  sendMoney: async (wallet_id, amount, note = '') => {
    try {
      return await fetchWithRetry(`${API_BASE_URL}/transactions/send`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ wallet_id, amount, note })
      });
    } catch (error) {
      console.error('Send money error:', error);
      throw error;
    }
  },

  getTransactions: async (type = 'all', limit = 50) => {
    try {
      return await fetchWithRetry(
        `${API_BASE_URL}/transactions?type=${type}&limit=${limit}`,
        { headers: getAuthHeaders() }
      );
    } catch (error) {
      console.error('Get transactions error:', error);
      throw error;
    }
  },

  getTransaction: async (id) => {
    try {
      return await fetchWithRetry(`${API_BASE_URL}/transactions/${id}`, {
        headers: getAuthHeaders()
      });
    } catch (error) {
      console.error('Get transaction error:', error);
      throw error;
    }
  }
};

// Beneficiary API
export const beneficiaryAPI = {
  getAll: async () => {
    try {
      return await fetchWithRetry(`${API_BASE_URL}/beneficiaries`, {
        headers: getAuthHeaders()
      });
    } catch (error) {
      console.error('Get beneficiaries error:', error);
      throw error;
    }
  },

  create: async (data) => {
    try {
      return await fetchWithRetry(`${API_BASE_URL}/beneficiaries`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      });
    } catch (error) {
      console.error('Create beneficiary error:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      return await fetchWithRetry(`${API_BASE_URL}/beneficiaries/${id}`, {
        headers: getAuthHeaders()
      });
    } catch (error) {
      console.error('Get beneficiary error:', error);
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      return await fetchWithRetry(`${API_BASE_URL}/beneficiaries/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      });
    } catch (error) {
      console.error('Update beneficiary error:', error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      return await fetchWithRetry(`${API_BASE_URL}/beneficiaries/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
    } catch (error) {
      console.error('Delete beneficiary error:', error);
      throw error;
    }
  }
};

// Admin API
export const adminAPI = {
  getAllUsers: async () => {
    try {
      return await fetchWithRetry(`${API_BASE_URL}/admin/users`, {
        headers: getAuthHeaders()
      });
    } catch (error) {
      console.error('Admin get users error:', error);
      throw error;
    }
  },

  getUser: async (id) => {
    try {
      return await fetchWithRetry(`${API_BASE_URL}/admin/users/${id}`, {
        headers: getAuthHeaders()
      });
    } catch (error) {
      console.error('Admin get user error:', error);
      throw error;
    }
  },

  updateUser: async (id, data) => {
    try {
      return await fetchWithRetry(`${API_BASE_URL}/admin/users/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      });
    } catch (error) {
      console.error('Admin update user error:', error);
      throw error;
    }
  },

  deleteUser: async (id) => {
    try {
      return await fetchWithRetry(`${API_BASE_URL}/admin/users/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
    } catch (error) {
      console.error('Admin delete user error:', error);
      throw error;
    }
  },

  getAllWallets: async () => {
    try {
      return await fetchWithRetry(`${API_BASE_URL}/admin/wallets`, {
        headers: getAuthHeaders()
      });
    } catch (error) {
      console.error('Admin get wallets error:', error);
      throw error;
    }
  },

  adjustWallet: async (id, action, amount) => {
    try {
      return await fetchWithRetry(`${API_BASE_URL}/admin/wallets/${id}/adjust`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ action, amount })
      });
    } catch (error) {
      console.error('Admin adjust wallet error:', error);
      throw error;
    }
  },

  getAllTransactions: async () => {
    try {
      return await fetchWithRetry(`${API_BASE_URL}/admin/transactions`, {
        headers: getAuthHeaders()
      });
    } catch (error) {
      console.error('Admin get transactions error:', error);
      throw error;
    }
  },

  getStats: async () => {
    try {
      return await fetchWithRetry(`${API_BASE_URL}/admin/stats`, {
        headers: getAuthHeaders()
      });
    } catch (error) {
      console.error('Admin get stats error:', error);
      throw error;
    }
  }
};

// Notification API
export const notificationAPI = {
  getAll: async (unreadOnly = false) => {
    try {
      const param = unreadOnly ? '?unread_only=true' : '';
      return await fetchWithRetry(`${API_BASE_URL}/notifications${param}`, {
        headers: getAuthHeaders()
      });
    } catch (error) {
      console.error('Get notifications error:', error);
      throw error;
    }
  },

  getUnreadCount: async () => {
    try {
      return await fetchWithRetry(`${API_BASE_URL}/notifications/unread-count`, {
        headers: getAuthHeaders()
      });
    } catch (error) {
      console.error('Get unread count error:', error);
      throw error;
    }
  },

  markAsRead: async (id) => {
    try {
      return await fetchWithRetry(`${API_BASE_URL}/notifications/${id}/read`, {
        method: 'PUT',
        headers: getAuthHeaders()
      });
    } catch (error) {
      console.error('Mark as read error:', error);
      throw error;
    }
  },

  markAllAsRead: async () => {
    try {
      return await fetchWithRetry(`${API_BASE_URL}/notifications/mark-all-read`, {
        method: 'PUT',
        headers: getAuthHeaders()
      });
    } catch (error) {
      console.error('Mark all as read error:', error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      return await fetchWithRetry(`${API_BASE_URL}/notifications/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
    } catch (error) {
      console.error('Delete notification error:', error);
      throw error;
    }
  },

  clearAll: async () => {
    try {
      return await fetchWithRetry(`${API_BASE_URL}/notifications/clear`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
    } catch (error) {
      console.error('Clear notifications error:', error);
      throw error;
    }
  }
};

// Utility functions
export const formatCurrency = (amount, currency = 'USD') => {
  const symbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    KES: 'KSh'
  };
  
  const symbol = symbols[currency] || currency;
  const value = parseFloat(amount) || 0;
  return `${symbol}${value.toFixed(2)}`;
};

export const validateAmount = (amount) => {
  const num = parseFloat(amount);
  if (isNaN(num) || num <= 0) {
    return { valid: false, error: 'Amount must be greater than 0' };
  }
  if (num > 10000) {
    return { valid: false, error: 'Amount cannot exceed $10,000' };
  }
  return { valid: true };
};

export const validatePhone = (phone) => {
  // Remove spaces and dashes
  const cleaned = phone.replace(/[\s\-]/g, '');
  
  // Check if it's a valid format
  if (cleaned.startsWith('0') && cleaned.length === 10) {
    return { valid: true, formatted: '254' + cleaned.slice(1) };
  }
  if (cleaned.startsWith('254') && cleaned.length === 12) {
    return { valid: true, formatted: cleaned };
  }
  if (cleaned.startsWith('+254') && cleaned.length === 13) {
    return { valid: true, formatted: cleaned.slice(1) };
  }
  
  return { valid: false, error: 'Invalid phone format. Use 07XXXXXXXX or 254XXXXXXXXX' };
};

// Export API Error class
export { APIError };

export default {
  auth: authAPI,
  user: userAPI,
  wallet: walletAPI,
  transaction: transactionAPI,
  beneficiary: beneficiaryAPI,
  admin: adminAPI,
  formatCurrency,
  validateAmount,
  validatePhone
};