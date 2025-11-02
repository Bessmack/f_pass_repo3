// src/services/api.js
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Helper function to handle API responses
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
      throw data;
    }
    
    return data;
  } else {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response;
  }
};

// Authentication API
export const authAPI = {
  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return handleResponse(response);
  },

  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return handleResponse(response);
  },

  getMe: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

// User API
export const userAPI = {
  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  updateProfile: async (data) => {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  changePassword: async (data) => {
    const response = await fetch(`${API_BASE_URL}/users/change-password`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  getAllUsers: async () => {
    const response = await fetch(`${API_BASE_URL}/users`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

// Wallet API
export const walletAPI = {
  getWallet: async () => {
    const response = await fetch(`${API_BASE_URL}/wallet`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  addFunds: async (amount, note = '', method = 'card') => {
    const response = await fetch(`${API_BASE_URL}/wallet/add-funds`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ amount, note, method })
    });
    return handleResponse(response);
  }
};

// Transaction API
export const transactionAPI = {
  sendMoney: async (receiver_id, amount, note = '') => {
    const response = await fetch(`${API_BASE_URL}/transactions/send`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ receiver_id, amount, note })
    });
    return handleResponse(response);
  },

  getTransactions: async (type = 'all', limit = 50) => {
    const response = await fetch(
      `${API_BASE_URL}/transactions?type=${type}&limit=${limit}`,
      { headers: getAuthHeaders() }
    );
    return handleResponse(response);
  },

  getTransaction: async (id) => {
    const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

// Beneficiary API
export const beneficiaryAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/beneficiaries`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  create: async (data) => {
    const response = await fetch(`${API_BASE_URL}/beneficiaries`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/beneficiaries/${id}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  update: async (id, data) => {
    const response = await fetch(`${API_BASE_URL}/beneficiaries/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/beneficiaries/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

// Admin API
export const adminAPI = {
  getAllUsers: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  getUser: async (id) => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  updateUser: async (id, data) => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  deleteUser: async (id) => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  getAllWallets: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/wallets`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  adjustWallet: async (id, action, amount) => {
    const response = await fetch(`${API_BASE_URL}/admin/wallets/${id}/adjust`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ action, amount })
    });
    return handleResponse(response);
  },

  getAllTransactions: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/transactions`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  getStats: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/stats`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
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
  return `${symbol}${parseFloat(amount).toFixed(2)}`;
};

export default {
  auth: authAPI,
  user: userAPI,
  wallet: walletAPI,
  transaction: transactionAPI,
  beneficiary: beneficiaryAPI,
  admin: adminAPI,
  formatCurrency
};